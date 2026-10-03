import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { handleAuthError, refreshSessionIfNeeded } from "@/utils/authUtils";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData?: Record<string, any>
  ) => Promise<{ user: User | null; session: Session | null } | null>;
  signOut: () => Promise<void>;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => null,
  signOut: async () => {},
  refreshSession: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initialize auth state - NON-BLOCKING
    const initializeAuth = () => {
      // Use setTimeout to make it non-blocking
      setTimeout(() => {
        supabase.auth
          .getSession()
          .then(({ data: { session }, error }) => {
            if (error) {
              console.error("Error getting session:", error);
            }

            if (mounted) {
              setSession(session);
              setUser(session?.user ?? null);

              // Handle profile creation/update for initial session
              if (session?.user) {
                handleUserProfile(session.user);
              }

              setLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error initializing auth:", error);
            if (mounted) {
              setLoading(false);
            }
          });
      }, 0);
    };

    // Handle user profile creation/update - NON-BLOCKING
    const handleUserProfile = (user: User) => {
      // Use setTimeout to make it completely non-blocking
      setTimeout(() => {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          .then(({ data: profile, error: profileError }) => {
            if (profileError && profileError.code === "PGRST116") {
              // Profile doesn't exist, create one for OAuth users
              supabase
                .from("profiles")
                .insert({
                  id: user.id,
                  email: user.email,
                  full_name:
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    "",
                  avatar_url: user.user_metadata?.avatar_url || "",
                  onboarded: false, // OAuth users need to go through onboarding
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
                .then(({ error: insertError }) => {
                  if (insertError) {
                    console.error(
                      "Error creating OAuth user profile:",
                      insertError
                    );
                  } else {
                    console.log("OAuth user profile created successfully");
                  }
                });
            } else if (profile) {
              // Profile exists, update onboarded status for existing users
              supabase
                .from("profiles")
                .update({
                  onboarded: true,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);
            }
          });
      }, 0);
    };

    // Set up auth state listener - NON-BLOCKING
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session?.user?.id);

      if (!mounted) return;

      // Handle async operations in a non-blocking way
      if (event === "SIGNED_IN" && session?.user) {
        // Use setTimeout to make it non-blocking
        setTimeout(() => {
          handleUserProfile(session.user);
        }, 0);
      }

      if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed successfully");
      }

      // Update state immediately (non-blocking)
      setSession(session);
      setUser(session?.user ?? null);

      // Only set loading to false if we haven't already initialized
      if (loading) {
        setLoading(false);
      }
    });

    // Initialize auth state
    initializeAuth();

    // Set up periodic session check (every 5 minutes) - NON-BLOCKING
    const sessionCheckInterval = setInterval(() => {
      if (!mounted) return;

      // Use setTimeout to make it non-blocking
      setTimeout(() => {
        supabase.auth
          .getSession()
          .then(({ data: { session } }) => {
            if (session && session.expires_at) {
              const expiresAt = new Date(session.expires_at * 1000);
              const now = new Date();
              const timeUntilExpiry = expiresAt.getTime() - now.getTime();

              // If session expires in less than 10 minutes, refresh it
              if (timeUntilExpiry < 10 * 60 * 1000 && timeUntilExpiry > 0) {
                console.log("Session expiring soon, refreshing...");
                refreshSession();
              }
            }
          })
          .catch((error) => {
            console.error("Error checking session:", error);
          });
      }, 0);
    }, 5 * 60 * 1000); // Check every 5 minutes

    // Refresh session when window gains focus - NON-BLOCKING
    const handleWindowFocus = () => {
      if (!mounted) return;

      // Use setTimeout to make it non-blocking
      setTimeout(() => {
        refreshSessionIfNeeded().catch((error) => {
          console.error("Error refreshing session on focus:", error);
        });
      }, 0);
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [loading]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Set onboarded to true for existing users on signin
      if (data.user) {
        try {
          await supabase
            .from("profiles")
            .update({
              onboarded: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", data.user.id);
        } catch (profileError) {
          console.warn("Failed to update onboarded status:", profileError);
          // Don't throw here as the signin was successful
        }
      }
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: Record<string, any>
  ) => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: userData,
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        }
      );

      if (signUpError) throw signUpError;

      console.log("SignUp response:", authData);
      console.log("User:", authData.user);
      console.log("Session:", authData.session);

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        console.log(
          "Email confirmation required - user created but not confirmed"
        );
        // User needs to confirm email
      } else if (authData.session) {
        console.log("User already confirmed - session created");
        // User is already confirmed and signed in
      }

      // Add default user role
      if (authData.user) {
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: "user",
        });

        if (roleError) {
          console.error("Error setting user role:", roleError);
          // Consider if you want to throw this error or handle it differently
        }
      }

      // Return the auth data for the dialog
      return {
        user: authData.user,
        session: authData.session,
      };
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const refreshSession = () => {
    setLoading(true);

    // Use setTimeout to make it non-blocking
    setTimeout(() => {
      refreshSessionIfNeeded()
        .then((success) => {
          if (!success) {
            // If refresh fails, sign out the user
            signOut();
            return;
          }

          // Get the updated session
          return supabase.auth.getSession();
        })
        .then(({ data: { session } }) => {
          if (session) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        })
        .catch((error) => {
          console.error("Error refreshing session:", error);
          signOut();
        })
        .finally(() => {
          setLoading(false);
        });
    }, 0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading: loading,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// RequireAuth component for protected routes
export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading your session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};
