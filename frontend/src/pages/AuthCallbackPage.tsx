import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing authentication...");
  const [authType, setAuthType] = useState<"email" | "oauth">("email");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if this is an OAuth callback by looking at URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const hasOAuthParams =
          urlParams.has("access_token") || urlParams.has("refresh_token");

        if (hasOAuthParams) {
          setAuthType("oauth");
          setMessage("Processing OAuth authentication...");
        } else {
          setAuthType("email");
          setMessage("Verifying your email...");
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setStatus("error");
          setMessage(
            authType === "oauth"
              ? "Failed to authenticate with Google. Please try again."
              : "Failed to verify your email. Please try again."
          );
          toast.error(
            authType === "oauth"
              ? "OAuth authentication failed"
              : "Email verification failed"
          );
          return;
        }

        if (data.session) {
          // User is now authenticated
          setStatus("success");
          setMessage(
            authType === "oauth"
              ? "Successfully signed in with Google! Redirecting..."
              : "Email verified successfully! Redirecting to dashboard..."
          );
          toast.success(
            authType === "oauth"
              ? "Successfully signed in!"
              : "Email verified successfully!"
          );

          // Check if user needs onboarding
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarded")
            .eq("id", data.session.user.id)
            .single();

          const redirectPath = profile?.onboarded ? "/dashboard" : "/interests";

          // Redirect after a short delay
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 2000);
        } else {
          // No session found, might be an error
          setStatus("error");
          setMessage(
            authType === "oauth"
              ? "OAuth authentication failed. Please try again."
              : "Verification link is invalid or expired."
          );
          toast.error(
            authType === "oauth"
              ? "OAuth authentication failed"
              : "Invalid verification link"
          );
        }
      } catch (error) {
        console.error("Unexpected error during auth callback:", error);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
        toast.error("Authentication failed");
      }
    };

    handleAuthCallback();
  }, [navigate, authType]);

  const handleRetry = () => {
    setStatus("loading");
    setMessage(
      authType === "oauth"
        ? "Processing OAuth authentication..."
        : "Verifying your email..."
    );
    // Reload the page to retry
    window.location.reload();
  };

  const handleGoToSignIn = () => {
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            )}
            {status === "success" && (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
            {status === "error" && <XCircle className="h-6 w-6 text-red-500" />}
            {authType === "oauth"
              ? "OAuth Authentication"
              : "Email Verification"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">{message}</p>

          {status === "error" && (
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
              <Button
                onClick={handleGoToSignIn}
                variant="outline"
                className="w-full"
              >
                Go to Sign In
              </Button>
            </div>
          )}

          {status === "loading" && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
