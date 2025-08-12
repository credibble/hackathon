import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TermsOfUseModalProps {
  open: boolean;
  onAccept: () => void;
}

export function TermsOfUseModal({ open, onAccept }: TermsOfUseModalProps) {
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleAccept = () => {
    if (hasAgreed) {
      onAccept();
    }
  };

  return (
    <Dialog open={open} modal>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-20px)] max-w-4xl max-h-[85vh] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg overflow-y-auto scrollbar-hide"
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center text-xl font-semibold">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
              Terms of Use Agreement
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="px-6 max-h-[45vh]">
            <div className="space-y-4 text-sm leading-relaxed">
              <section>
                <h3 className="font-semibold text-base mb-2">
                  1. Acceptance of Terms
                </h3>
                <p className="text-muted-foreground">
                  By accessing and using the Credibble DeFi platform, you
                  acknowledge that you have read, understood, and agree to be
                  bound by these Terms of Use and all applicable laws and
                  regulations.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">
                  2. Platform Description
                </h3>
                <p className="text-muted-foreground">
                  Credibble DeFi is a decentralized finance platform that
                  facilitates lending and borrowing activities through smart
                  contracts. The platform connects lenders with borrowers to
                  provide financial services in emerging markets.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">
                  3. Risk Disclosure
                </h3>
                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                    Important Risk Warning:
                  </p>
                  <ul className="space-y-1 text-amber-700 dark:text-amber-300">
                    <li>
                      • DeFi investments carry significant financial risk and
                      potential loss of capital
                    </li>
                    <li>
                      • Smart contract risks may result in permanent loss of
                      funds
                    </li>
                    <li>
                      • Cryptocurrency values are highly volatile and
                      unpredictable
                    </li>
                    <li>
                      • Loan defaults may result in partial or total loss of
                      principal
                    </li>
                    <li>• Regulatory changes may affect platform operations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">
                  4. Eligibility Requirements
                </h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years old and legally capable of
                  entering into binding agreements. You are responsible for
                  compliance with all applicable laws in your jurisdiction.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">
                  5. Prohibited Activities
                </h3>
                <p className="text-muted-foreground">
                  You agree not to use the platform for any illegal activities,
                  money laundering, fraud, or any activities that violate
                  applicable laws or regulations.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">
                  6. Limitation of Liability
                </h3>
                <p className="text-muted-foreground">
                  The platform is provided "as is" without warranties. We shall
                  not be liable for any direct, indirect, incidental, or
                  consequential damages arising from your use of the platform.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">
                  7. Privacy and Data
                </h3>
                <p className="text-muted-foreground">
                  Your privacy is important to us. Please review our Privacy
                  Policy to understand how we collect, use, and protect your
                  information.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">
                  8. Modifications
                </h3>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time.
                  Continued use of the platform constitutes acceptance of any
                  modifications.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">
                  9. Governing Law
                </h3>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance
                  with applicable laws. Any disputes shall be resolved through
                  binding arbitration.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">
                  10. Contact Information
                </h3>
                <p className="text-muted-foreground">
                  For questions about these terms, please contact us at
                  credibble.xyz@gmail.com
                </p>
              </section>
            </div>
          </ScrollArea>

          <div className="p-6 pt-4 border-t">
            <div className="flex items-start space-x-3 mb-4">
              <Checkbox
                id="terms-agreement"
                checked={hasAgreed}
                onCheckedChange={(checked) => setHasAgreed(checked === true)}
                className="mt-1"
              />
              <label
                htmlFor="terms-agreement"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I have read, understood, and agree to the Terms of Use. I
                acknowledge the risks associated with DeFi investments and
                understand that I may lose some or all of my investment.
              </label>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleAccept}
                disabled={!hasAgreed}
                size="lg"
                className="font-semibold"
              >
                Agree and Continue to App
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
