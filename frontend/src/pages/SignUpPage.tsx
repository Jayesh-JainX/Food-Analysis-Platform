import { SignUpForm } from "@/components/auth/SignUpForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/shared/Header";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [navigate, user, isLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <SignUpForm />
      </main>
    </div>
  );
}
