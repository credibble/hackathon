import express, { Request, Response } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import cors from "cors";
import { JoinRequest, WaitlistUser } from "./types";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_APP_PASSWORD!,
  },
  tls: { rejectUnauthorized: true },
});

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function generateVerificationCode(): string {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-character code
}

async function sendVerificationEmail(
  email: string,
  name: string | null,
  verificationCode: string
): Promise<void> {
  const mailOptions = {
    from: `"Credibble" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your waitlist signup",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Almost there!</h2>
        <p>Hi ${name || "there"},</p>
        <p>Thank you for joining our waitlist. Please verify your email address by entering this code:</p>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; font-size: 24px; letter-spacing: 2px;">
          ${verificationCode}
        </div>
        
        <p>If you didn't request to join our waitlist, please ignore this email.</p>
        <hr>
        <p style="font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} Credibble. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw error;
  }
}

// POST endpoint for joining waitlist
app.post("/join", async (req: Request, res: Response) => {
  try {
    let { name, email }: JoinRequest = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    email = normalizeEmail(email);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const { data: existingUser, error: queryError } = await supabase
      .from("waitlist")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (queryError) {
      throw queryError;
    }

    if (existingUser) {
      return res.status(200).json({
        message: existingUser.is_verified
          ? "You are already on the waitlist"
          : "Verification email sent again. Please check your inbox.",
        is_verified: existingUser.is_verified,
      });
    }

    const verificationCode = generateVerificationCode();
    const newUser: Omit<WaitlistUser, "id"> = {
      name: name || null,
      email,
      is_verified: false,
      verification_code: verificationCode,
      verified_at: null,
    };

    const { data: _, error: insertError } = await supabase
      .from("waitlist")
      .insert([newUser])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    sendVerificationEmail(email, name || null, verificationCode).catch(
      (error) => {
        console.error("Error in email sending process:", error);
      }
    );

    return res.status(201).json({
      message: "Verification email sent. Please check your inbox.",
      email: email,
      verification_sent: true,
    });
  } catch (error) {
    console.error("Error processing join request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Verification endpoint
app.get("/verify", async (req: Request, res: Response) => {
  try {
    let { email, code } = req.query;

    if (!email || !code) {
      return res
        .status(400)
        .json({ error: "Email and verification code are required" });
    }

    email = normalizeEmail(email.toString());
    code = code.toString().toUpperCase();

    const { data: user, error: queryError } = await supabase
      .from("waitlist")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (queryError) {
      throw queryError;
    }

    if (!user) {
      return res.status(404).json({ error: "Email not found on waitlist" });
    }

    if (user.is_verified) {
      return res.status(200).json({
        message: "Email already verified",
        is_verified: true,
      });
    }

    if (user.verification_code !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Verify user
    const { error: updateError } = await supabase
      .from("waitlist")
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verification_code: null,
      })
      .eq("email", email);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      message: "Email successfully verified!",
      is_verified: true,
    });
  } catch (error) {
    console.error("Error processing verification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
