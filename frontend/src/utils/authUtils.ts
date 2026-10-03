import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleAuthError = (error: any) => {
  console.error("Auth error:", error);
  
  // Handle specific auth errors
  if (error?.message?.includes("Invalid login credentials")) {
    toast.error("Invalid email or password");
  } else if (error?.message?.includes("Email not confirmed")) {
    toast.error("Please check your email and confirm your account");
  } else if (error?.message?.includes("Token expired")) {
    toast.error("Your session has expired. Please sign in again.");
  } else if (error?.message?.includes("User not found")) {
    toast.error("User not found. Please check your credentials.");
  } else {
    toast.error(error?.message || "Authentication error occurred");
  }
};

export const checkSessionValidity = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session check error:", error);
      return false;
    }
    
    if (!session) {
      return false;
    }
    
    // Check if session is expired
    if (session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      
      if (expiresAt <= now) {
        console.log("Session expired");
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error checking session validity:", error);
    return false;
  }
};

export const refreshSessionIfNeeded = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session && session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      // If session expires in less than 5 minutes, refresh it
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        console.log("Refreshing session...");
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error("Error refreshing session:", error);
          return false;
        }
        
        return !!data.session;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error refreshing session:", error);
    return false;
  }
}; 