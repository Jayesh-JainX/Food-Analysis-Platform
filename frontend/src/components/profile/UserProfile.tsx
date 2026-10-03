import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Save, Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { NutritionPreferences } from "./NutritionPreferences";

export function UserProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarKey, setAvatarKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  // Function to get fresh avatar URL with cache busting
  const getFreshAvatarUrl = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url, updated_at")
        .eq("id", userId)
        .single();

      if (error) throw error;

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        // Get profile data from Supabase
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // Set email from user auth data
        setEmail(user.email || "");

        // Set name from profile
        setName(profile?.full_name || user.email?.split("@")[0] || "");

        // Set avatar URL with cache busting if available
        if (profile?.avatar_url) {
          const freshAvatarUrl = await getFreshAvatarUrl(user.id);
          setAvatarUrl(freshAvatarUrl);
          setAvatarKey((prev) => prev + 1); // Force re-render
        } else {
          setAvatarUrl("");
          setAvatarKey((prev) => prev + 1);
        }

        // Create initials from name
        const initials = (profile?.full_name || "")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
        setUserInitials(
          initials || user.email?.substring(0, 2).toUpperCase() || "WU"
        );
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          updated_at: new Date().toISOString(),
          onboarded: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update initials based on new name
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
      setUserInitials(
        initials || user.email?.substring(0, 2).toUpperCase() || "WU"
      );

      // Dispatch custom event to notify header component
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: {
            fullName: name,
            userInitials:
              initials || user.email?.substring(0, 2).toUpperCase() || "WU",
            userId: user.id,
          },
        })
      );

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadFile = e.target.files[0];

      // Validate file type
      if (!uploadFile.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (2MB limit)
      if (uploadFile.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      const fileExt = uploadFile.name.split(".").pop()?.toLowerCase();
      const timestamp = new Date().getTime();
      const fileName = `${user.id}/avatar_${timestamp}.${fileExt}`;

      // Remove old avatar first
      try {
        const { data: existingFiles } = await supabase.storage
          .from("profile-images")
          .list(user.id);

        if (existingFiles && existingFiles.length > 0) {
          const filesToRemove = existingFiles.map(
            (file) => `${user.id}/${file.name}`
          );
          await supabase.storage.from("profile-images").remove(filesToRemove);
        }
      } catch (cleanupError) {
        console.warn("Could not clean up old avatar:", cleanupError);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, uploadFile, {
          cacheControl: "0",
          upsert: false,
          contentType: uploadFile.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Set new avatar URL with cache busting
      const cacheBustedUrl = `${publicUrl}?t=${timestamp}`;
      setAvatarUrl(cacheBustedUrl);
      setAvatarKey((prev) => prev + 1); // Force re-render

      // Update user initials based on current name
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
      setUserInitials(
        initials || user.email?.substring(0, 2).toUpperCase() || "WU"
      );

      // Dispatch custom event to notify header component
      window.dispatchEvent(
        new CustomEvent("avatarUpdated", {
          detail: {
            avatarUrl: cacheBustedUrl,
            timestamp: timestamp,
            userId: user.id,
            userInitials:
              initials || user.email?.substring(0, 2).toUpperCase() || "WU",
          },
        })
      );

      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading(false);
      // Clear the input
      e.target.value = "";
    }
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (profile) {
        // Update name
        setName(profile.full_name || "");

        // Update avatar with fresh URL
        if (profile.avatar_url) {
          const freshAvatarUrl = await getFreshAvatarUrl(user.id);
          setAvatarUrl(freshAvatarUrl);
          setAvatarKey((prev) => prev + 1); // Force re-render
        } else {
          setAvatarUrl("");
          setAvatarKey((prev) => prev + 1);
        }

        // Update initials
        const initials = (profile.full_name || "")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
        setUserInitials(
          initials || user.email?.substring(0, 2).toUpperCase() || "WU"
        );
      }

      toast.success("Profile refreshed successfully");
    } catch (error) {
      console.error("Error refreshing profile:", error);
      toast.error("Failed to refresh profile");
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshProfile}
          disabled={isUploading || isSaving}
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Photo Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Avatar className="h-40 w-40">
                <AvatarImage
                  src={avatarUrl}
                  alt={name}
                  key={`${avatarKey}-${avatarUrl}`} // Force re-render when URL or key changes
                  onError={() => {
                    console.log("Avatar failed to load, using fallback");
                  }}
                />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <label htmlFor="avatar-upload">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 text-xs cursor-pointer"
                  type="button"
                  disabled={isUploading}
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                >
                  <Camera className="mr-2 h-3 w-3" />
                  {isUploading ? "Uploading..." : "Change Photo"}
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Max 2MB • JPG, PNG, WebP
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  readOnly
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed
                </p>
              </div>

              <Button
                onClick={handleSave}
                className="wellness-gradient"
                disabled={isSaving || isUploading}
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <NutritionPreferences />
      </div>
    </div>
  );
}
