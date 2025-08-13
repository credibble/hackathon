import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import { toast } from "sonner";
import { set } from "zod";

const targetDate = new Date("2025-10-15T00:00:00");

function useCountdown(to: Date) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const total = Math.max(0, to.getTime() - now.getTime());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, total };
  }, [now, to]);
}

const WaitlistPage = () => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_WAITLIST_API}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to join waitlist");

      toast.info(data?.message);

      if (data?.is_verified) {
        setShowFollowModal(true);
      } else {
        setShowVerifyModal(true);
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) return;
    setVerifying(true);

    try {
      const params = new URLSearchParams({
        email: email.trim().toLowerCase(),
        code: verificationCode.trim().toUpperCase(),
      });
      const res = await fetch(
        `${import.meta.env.VITE_WAITLIST_API}/verify?${params.toString()}`
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Verification failed");

      if (data?.is_verified) {
        setShowVerifyModal(false);
        setShowFollowModal(true);
      }

      toast.success(data?.message || "Verified!");

      setVerificationCode("");
      setEmail("");
      setName("");
    } catch (err) {
      toast.error(err?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
      <LandingHeader />

      <header className="w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-10">
        <div className="mx-auto max-w-5xl px-4 py-section">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Join the Credibble Waitlist
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Be first to access our upcoming testnet. We're picking 10 random
            supporters to share a $50 USDT pool. Opt in below and stay tuned.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-section grid gap-6 md:gap-8">
        {/* Countdown & Rewards */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Testnet Airdrop Countdown</CardTitle>
              <CardDescription>Launching October 15</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { label: "Days", value: days },
                  { label: "Hours", value: hours },
                  { label: "Minutes", value: minutes },
                  { label: "Seconds", value: seconds },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="rounded-md bg-card/60 p-4 shadow-sm border"
                  >
                    <div className="text-2xl md:text-3xl font-semibold tabular-nums">
                      {String(t.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground">
                      {t.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Rewards</Badge>
                <CardTitle>Waitlist Perks</CardTitle>
              </div>
              <CardDescription>
                Randomly picking 10 winners for a shared $50 USDT pool.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Automatic entry when you join the waitlist</li>
                <li>Winners announced around the testnet date</li>
                <li>Follow on X/Twitter for bonus chances</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Join Form */}
        <section>
          <Card className="overflow-hidden animate-fade-in">
            <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-secondary" />
            <CardHeader>
              <CardTitle>Get Early Access</CardTitle>
              <CardDescription>
                Join the list and we'll keep you posted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                  <label className="mb-1 block text-sm text-muted-foreground">
                    Name (optional)
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    aria-label="Name"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="mb-1 block text-sm text-muted-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Email"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Joining…" : "Join Waitlist"}
                  </Button>
                </div>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                By joining, you agree to receive occasional product updates.
                Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Verification Modal */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription>
              Enter the 6-character code we sent to {email}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 pt-2">
            <label className="text-sm text-muted-foreground">
              Verification code
            </label>
            <Input
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.toUpperCase())
              }
              placeholder="ABC123"
              maxLength={6}
              autoFocus
              aria-label="Verification code"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowVerifyModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={verifying || verificationCode.length < 6}
            >
              {verifying ? "Verifying…" : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Follow Modal */}
      <Dialog open={showFollowModal} onOpenChange={setShowFollowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thanks for joining! 🎉</DialogTitle>
            <DialogDescription>
              To maximize your chances and get the latest updates, follow us on
              Twitter/X.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild className="flex-1">
              <a
                href="https://x.com/intent/follow?screen_name=credibble_fi"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow on Twitter/X
              </a>
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowFollowModal(false)}
            >
              Maybe later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LandingFooter />
    </div>
  );
};

export default WaitlistPage;
