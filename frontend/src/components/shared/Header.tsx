import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut,
  Settings,
  Menu,
  LayoutDashboard,
  Camera,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileRecord } from "@/integrations/supabase/database-types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardNavigation } from "../dashboard/DashboardNavigation";
import { NotificationsPopover } from "@/components/ui/notifications-popover";
import { ThemeToggle } from "../ThemeToggle";

interface DashboardHeaderProps {
  showNavigation?: boolean;
}

export function Header({ showNavigation = true }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userInitials, setUserInitials] = useState("WU");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarKey, setAvatarKey] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSheetClose = () => {
    setIsSheetOpen(false);
  };

  // Function to get fresh avatar URL with cache busting
  const getFreshAvatarUrl = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, updated_at")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const profile = data as Pick<
        ProfileRecord,
        "avatar_url" | "updated_at"
      > | null;

      if (profile?.avatar_url) {
        // Use updated_at timestamp for cache busting
        const timestamp = profile.updated_at
          ? new Date(profile.updated_at).getTime()
          : new Date().getTime();
        const separator = profile.avatar_url.includes("?") ? "&" : "?";
        return `${profile.avatar_url}${separator}t=${timestamp}`;
      }
      return "";
    } catch (error) {
      console.error("Error fetching fresh avatar URL:", error);
      return "";
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, updated_at")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const profile = data as Pick<
        ProfileRecord,
        "full_name" | "avatar_url" | "updated_at"
      > | null;

      if (profile) {
        setFullName(profile.full_name || "");

        // Get fresh avatar URL with cache busting
        if (profile.avatar_url) {
          const freshAvatarUrl = await getFreshAvatarUrl(user.id);
          setAvatarUrl(freshAvatarUrl);
          setAvatarKey((prev) => prev + 1); // Force re-render
        } else {
          setAvatarUrl("");
          setAvatarKey((prev) => prev + 1);
        }

        const initials = profile.full_name
          ? profile.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
          : user.email?.substring(0, 2).toUpperCase() || "WU";
        setUserInitials(initials);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();

      // Set up real-time subscription for profile changes
      const channelName = `profile-changes-${user.id}`;
      supabase.getChannels().forEach((c) => {
        if (c.topic === channelName || c.topic === `realtime:${channelName}`) {
          supabase.removeChannel(c);
        }
      });

      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Profile updated in header:", payload);
            // Add a small delay to ensure the database is updated
            setTimeout(() => {
              fetchUserProfile();
            }, 500);
          }
        )
        .subscribe();

      // Listen for custom avatar update events
      const handleAvatarUpdate = () => {
        console.log("Avatar update event received");
        fetchUserProfile();
      };

      window.addEventListener("avatarUpdated", handleAvatarUpdate);

      return () => {
        supabase.removeChannel(channel);
        window.removeEventListener("avatarUpdated", handleAvatarUpdate);
      };
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  // Function to refresh profile manually
  const refreshProfile = () => {
    if (user) {
      fetchUserProfile();
    }
  };

  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          {/* Mobile Navigation Menu - Only show if showNavigation is true and user is logged in */}
          {showNavigation && user && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden p-1 h-auto w-auto">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 pt-10 w-[240px]">
                <DashboardNavigation onNavItemClick={handleSheetClose} />
              </SheetContent>
            </Sheet>
          )}

          {/* Logo */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="ml-2 sm:ml-0 flex items-center gap-2 notranslate relative"
          >
            {/* Lamp GIF Background */}
            <div className="absolute pb-5 inset-0 flex items-center justify-center pointer-events-none">
              <img
                src="/lamp.gif"
                alt=""
                className="w-full h-16 opacity-20 mix-blend-screen filter brightness-150 contrast-150"
                style={{
                  filter: "brightness(3) contrast(1.5) saturate(1.2)",
                  mixBlendMode: "screen",
                }}
              />
            </div>

            <span className="text-xl font-bold pb-0.5 sm:pb-0 relative z-10">
              <span className="text-primary">Wellness</span> AI Lens
            </span>
          </Link>
        </div>

        <div className="flex items-center sm:gap-2 lg:gap-3">
          <span className="mr-2 sm:mr-0">
            <ThemeToggle />
          </span>
          {user ? (
            <>
              <NotificationsPopover />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ml-2 sm:mr-0"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={avatarUrl}
                        alt={fullName}
                        key={`${avatarKey}-${avatarUrl}`} // Force re-render when avatar changes
                        onError={() => {
                          console.log("Avatar failed to load in header");
                        }}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>{fullName || "User"}</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/scanner")}>
                    <Camera className="mr-2 h-4 w-4" />
                    <span>Food Scanner</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/nutrition")}>
                    <Utensils className="mr-2 h-4 w-4" />
                    <span>Nutrition</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
              <Button
                className="wellness-gradient"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
