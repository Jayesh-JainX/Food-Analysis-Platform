import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Lock,
  User,
  Shield,
  CreditCard,
  Languages,
  Palette,
  X,
  Plus,
  Camera,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAppContext } from "@/context/AppContext";
import { NutritionPreferences } from "@/components/profile/NutritionPreferences";
import { supabase } from "@/integrations/supabase/client";
import { NotificationSettings } from "@/components/notification/NotificationSetting";

const wellnessInterests = [
  { id: "nutrition", label: "Nutrition" },
  { id: "fitness", label: "Fitness" },
  { id: "mental-health", label: "Mental Health" },
  { id: "weight-loss", label: "Weight Loss" },
  { id: "allergens", label: "Food Allergies" },
  { id: "diet", label: "Special Diets" },
  { id: "supplements", label: "Supplements" },
  { id: "sleep", label: "Sleep Health" },
  { id: "cooking", label: "Healthy Cooking" },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { dashboardLayout, updateDashboardLayout } = useAppContext();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const [profileVisibility, setProfileVisibility] = useState("private");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [isSavingInterests, setIsSavingInterests] = useState(false);

  const [settings, setSettings] = useState({
    dashboardStyle: dashboardLayout.style,
    unitsOfMeasurement: "metric",
  });

  // Function to get fresh avatar URL with cache busting
  const getFreshAvatarUrl = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (profile?.avatar_url) {
        // Add timestamp to bust cache
        const timestamp = new Date().getTime();
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
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      dashboardStyle: dashboardLayout.style,
    }));
  }, [dashboardLayout]);

  const fetchUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (profile) {
        setFullName(profile.full_name || "");
        setInterests(profile.interests || []);
        setSelectedInterests(profile.interests || []);

        // Set avatar URL with cache busting if available
        if (profile?.avatar_url) {
          const freshAvatarUrl = await getFreshAvatarUrl(user.id);
          setAvatarUrl(freshAvatarUrl);
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
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveInterests = async () => {
    if (!user) return;

    setIsSavingInterests(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          interests: selectedInterests,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update the interests state to reflect the saved data
      setInterests(selectedInterests);
      toast.success("Interests saved successfully");
    } catch (error) {
      console.error("Error saving interests:", error);
      toast.error("Failed to save interests");
    } finally {
      setIsSavingInterests(false);
    }
  };

  const handleAvatarChange = async (event) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadFile = event.target.files[0];

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

      // Update user initials based on current name
      const initials = (fullName || "")
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
          },
        })
      );

      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = "";
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
  };

  const saveAccountSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          interests: selectedInterests,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Account settings saved successfully");
    } catch (error) {
      console.error("Error saving account settings:", error);
      toast.error("Failed to save account settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast.error("No email address found");
      return;
    }

    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast.error("Failed to send password reset email");
    } finally {
      setSendingReset(false);
    }
  };

  const saveAppearanceSettings = () => {
    setSaving(true);

    // Update the dashboard layout immediately
    updateDashboardLayout({
      style: settings.dashboardStyle,
    });

    // Save to localStorage for persistence
    localStorage.setItem(
      "dashboardLayout",
      JSON.stringify({
        style: settings.dashboardStyle,
        cardSize: dashboardLayout.cardSize,
      })
    );

    // Also save to the old key for backward compatibility
    localStorage.setItem(
      "dashboardSettings",
      JSON.stringify({
        style: settings.dashboardStyle,
      })
    );

    setTimeout(() => {
      setSaving(false);
      toast.success("Dashboard layout updated successfully");
    }, 300);
  };

  const savePrivacySettings = () => {
    setSaving(true);

    localStorage.setItem(
      "privacySettings",
      JSON.stringify({
        profileVisibility,
      })
    );

    setTimeout(() => {
      setSaving(false);
      toast.success("Privacy settings saved successfully");
    }, 500);
  };

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));

    // Apply changes immediately for preview
    if (setting === "dashboardStyle") {
      updateDashboardLayout({
        style: value,
      });
    }
  };

  useEffect(() => {
    const savedDashboardSettings = localStorage.getItem("dashboardSettings");
    const savedPrivacySettings = localStorage.getItem("privacySettings");

    if (savedDashboardSettings) {
      const dashboardSettings = JSON.parse(savedDashboardSettings);
      setSettings((prev) => ({
        ...prev,
        dashboardStyle: dashboardSettings.style,
      }));
      updateDashboardLayout(dashboardSettings);
    }

    if (savedPrivacySettings) {
      const privacySettings = JSON.parse(savedPrivacySettings);
      setProfileVisibility(privacySettings.profileVisibility || "private");
    }
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        {/* Mobile Tabs List - 2x2 Grid Layout */}
        <div className="w-full sm:hidden">
          <div className="grid grid-cols-2 gap-2">
            <TabsList className="w-full">
              <TabsTrigger value="account" className="w-full text-xs">
                Account
              </TabsTrigger>
            </TabsList>

            <TabsList className="w-full">
              <TabsTrigger value="nutrition" className="w-full text-xs">
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsList className="w-full">
              <TabsTrigger value="appearance" className="w-full text-xs">
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsList className="w-full">
              <TabsTrigger value="privacy" className="w-full text-xs">
                Privacy
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Desktop TabsList - Single Row */}
        <div className="hidden sm:block">
          <TabsList className="grid grid-cols-4 h-auto p-1 lg:w-[600px]">
            <TabsTrigger value="account" className="text-sm">
              Account
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="text-sm">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-sm">
              Appearance
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-sm">
              Privacy & Security
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="account" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Avatar Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Profile Avatar</CardTitle>
                <CardDescription className="text-sm">
                  Update your profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <Avatar className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48">
                      <AvatarImage
                        src={avatarUrl}
                        alt={fullName}
                        key={avatarUrl} // Force re-render when URL changes
                        onError={() => {
                          console.log("Avatar failed to load, using fallback");
                        }}
                      />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar"
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                  </div>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {isUploading ? "Uploading..." : "Click camera to upload"}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    Max 2MB • JPG, PNG, WebP
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      readOnly
                      className="bg-muted/50"
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed
                </p>

                <div className="pt-4">
                  <Button
                    onClick={saveAccountSettings}
                    disabled={saving || isUploading}
                    className="w-full sm:w-auto wellness-gradient"
                  >
                    {saving ? "Saving..." : "Save Account Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <NotificationSettings />
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <NutritionPreferences />

          {/* Interests & Preferences Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle>Interests & Preferences</CardTitle>
              <CardDescription>
                Select topics you're interested in to personalize your wellness
                journey
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {wellnessInterests.map((interest) => (
                  <div
                    key={interest.id}
                    className={`
                      border rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-colors
                      ${
                        selectedInterests.includes(interest.id)
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }
                    `}
                    onClick={() => handleInterestToggle(interest.id)}
                  >
                    <Checkbox
                      checked={selectedInterests.includes(interest.id)}
                      onCheckedChange={() => handleInterestToggle(interest.id)}
                    />
                    <div>
                      <div className="font-medium">{interest.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSaveInterests}
                className="wellness-gradient w-full"
                disabled={isSavingInterests}
              >
                {isSavingInterests ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how Wellness AI Lens looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <Palette className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium">Color Theme</p>
                    <p className="text-sm text-muted-foreground">
                      Choose between light and dark mode
                    </p>
                  </div>
                </div>
                <ThemeToggle />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Dashboard Layout</p>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred dashboard style
                    </p>
                  </div>
                </div>

                {/* Mobile notice */}
                <div className="md:hidden p-4 bg-muted/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Languages className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        Desktop Only Feature
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dashboard layout customization is available on desktop
                        devices only
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop layout selector */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      settings.dashboardStyle === "compact"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() =>
                      handleSettingChange("dashboardStyle", "compact")
                    }
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm">Compact</span>
                      {settings.dashboardStyle === "compact" && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="h-2 bg-muted rounded w-3/4"></div>
                      <div className="h-2 bg-muted rounded w-1/2"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Focused layout with essential information
                    </p>
                  </div>

                  <div
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      settings.dashboardStyle === "standard"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() =>
                      handleSettingChange("dashboardStyle", "standard")
                    }
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm">Standard</span>
                      {settings.dashboardStyle === "standard" && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="h-2 bg-muted rounded w-2/3"></div>
                      <div className="h-2 bg-muted rounded w-1/3"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Balanced layout with good information density
                    </p>
                  </div>

                  <div
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      settings.dashboardStyle === "detailed"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() =>
                      handleSettingChange("dashboardStyle", "detailed")
                    }
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm">Detailed</span>
                      {settings.dashboardStyle === "detailed" && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="h-2 bg-muted rounded w-4/5"></div>
                      <div className="h-2 bg-muted rounded w-3/5"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Comprehensive layout with maximum information
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop save buttons */}
              <div className="pt-4 hidden md:flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={saveAppearanceSettings}
                  disabled={saving}
                  className="w-full sm:w-auto wellness-gradient"
                >
                  {saving ? "Saving..." : "Save Layout Settings"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const defaultSettings = {
                      dashboardStyle: "standard" as const,
                    };
                    setSettings((prev) => ({ ...prev, ...defaultSettings }));
                    updateDashboardLayout({ style: "standard" });
                  }}
                  className="w-full sm:w-auto"
                >
                  Reset to Default
                </Button>
              </div>

              {/* Mobile save button */}
              <div className="pt-4 md:hidden">
                <Button
                  onClick={saveAppearanceSettings}
                  disabled={saving}
                  className="w-full wellness-gradient"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security Settings</CardTitle>
              <CardDescription>
                Control your data and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium">Password Reset</p>
                    <p className="text-sm text-muted-foreground break-words">
                      Send password reset link to your email ({user?.email})
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handlePasswordReset}
                  disabled={sendingReset}
                  className="w-full sm:w-auto flex-shrink-0"
                >
                  {sendingReset ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>

              {/* Profile Visibility - Enhanced Coming Soon */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-start space-x-4">
                  <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          Profile Visibility
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Control who can see your profile information and
                          wellness data
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-full">
                          <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                          Expected in next update
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Factor Authentication - Enhanced Coming Soon */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-start space-x-4">
                  <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          Multi-Factor Authentication (MFA)
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add an extra layer of security to your account with
                          SMS or authenticator apps
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                          <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                          Enhanced security features
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={savePrivacySettings}
                    disabled={saving}
                    className="w-full sm:w-auto wellness-gradient"
                  >
                    {saving ? "Saving..." : "Save Privacy Settings"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Your privacy settings are saved locally and synced across your
                  devices
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
