import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EmailConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function EmailConfirmationDialog({
  isOpen,
  onClose,
  email,
}: EmailConfirmationDialogProps) {
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Extract domain from email for delivery time messaging
  const emailDomain = email.split("@")[1]?.toLowerCase() || "";
  const isGmail = emailDomain === "gmail.com";
  const isOutlook =
    emailDomain === "outlook.com" || emailDomain === "hotmail.com";
  const isYahoo = emailDomain === "yahoo.com";

  // Start cooldown when dialog opens
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      // Start initial cooldown when dialog opens for fresh signup
      setCooldownSeconds(60);
      setHasInitialized(true);
    }
  }, [isOpen, hasInitialized]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCooldownSeconds(0);
      setResendCount(0);
      setIsResendLoading(false);
      setHasInitialized(false);
    }
  }, [isOpen]);

  // Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (cooldownSeconds > 0) {
      interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [cooldownSeconds]);

  const handleResendEmail = async () => {
    if (cooldownSeconds > 0) return;

    setIsResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      setResendCount((prev) => prev + 1);
      setCooldownSeconds(60);
      toast.success("Verification email resent successfully!");
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error(error.message || "Failed to resend verification email");
    } finally {
      setIsResendLoading(false);
    }
  };

  const getDeliveryTimeMessage = () => {
    if (isGmail) {
      return "Gmail users typically receive emails instantly.";
    } else if (isOutlook) {
      return "Outlook/Hotmail may take 1-2 minutes to deliver emails.";
    } else if (isYahoo) {
      return "Yahoo Mail may take 2-3 minutes to deliver emails.";
    } else {
      return "Other email providers may take 1-5 minutes to deliver emails.";
    }
  };

  const getSpamFolderMessage = () => {
    if (isGmail) {
      return "Check your Gmail inbox and spam folder.";
    } else if (isOutlook) {
      return "Check your Outlook inbox, junk folder, and spam folder.";
    } else if (isYahoo) {
      return "Check your Yahoo inbox and spam folder.";
    } else {
      return "Check your inbox and spam/junk folder.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Check your email
          </DialogTitle>
          <DialogDescription>
            We just sent a verification link to <strong>{email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email Sent Success Message */}
          <Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Verification email sent successfully!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {getDeliveryTimeMessage()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Time Info */}
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                    Email Delivery Times:
                  </p>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Gmail: Usually instant</li>
                    <li>• Outlook/Hotmail: 1-2 minutes</li>
                    <li>• Yahoo: 2-3 minutes</li>
                    <li>• Other providers: 1-5 minutes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resend Section */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Didn't receive the email? {getSpamFolderMessage()}
              </p>

              <Button
                onClick={handleResendEmail}
                disabled={isResendLoading || cooldownSeconds > 0}
                variant="outline"
                className="w-full"
              >
                {isResendLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : cooldownSeconds > 0 ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Resend in {cooldownSeconds}s
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend verification email
                  </>
                )}
              </Button>
            </div>

            {resendCount > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                Email resent {resendCount} time{resendCount !== 1 ? "s" : ""}
              </p>
            )}
            {resendCount === 0 && cooldownSeconds > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                Initial cooldown active - please wait before resending
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button
              onClick={() => (window.location.href = "/signin")}
              className="flex-1"
            >
              Go to Sign In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
