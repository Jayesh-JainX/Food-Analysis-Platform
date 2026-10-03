import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Shield, Info } from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/use-notifications";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { requestNotificationPermission } from "@/utils/notifications";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Notification types configuration
const NOTIFICATION_TYPES = [
  {
    key: "food_scan_low_score",
    title: "Low Health Score Alerts",
    description: "Get notified when scanned food has a low health score",
    icon: "⚠️",
    canDisable: true,
  },
  {
    key: "achievement",
    title: "Achievements",
    description: "Celebrate your health and fitness milestones",
    icon: "🏆",
    canDisable: true,
  },
  {
    key: "goal_reached",
    title: "Daily Goals",
    description: "Notifications when you reach daily nutrition goals",
    icon: "🎯",
    canDisable: true,
  },
  {
    key: "health_update",
    title: "Health Updates",
    description: "Regular updates about your health metrics",
    icon: "📊",
    canDisable: true,
  },
  {
    key: "nutrition_reminder",
    title: "Nutrition Reminders",
    description: "Reminders to log meals and track nutrition",
    icon: "🍎",
    canDisable: true,
  },
  {
    key: "daily_summary",
    title: "Daily Summary",
    description: "End-of-day summary of your health activities",
    icon: "📋",
    canDisable: true,
  },
  {
    key: "streak_milestone",
    title: "Streak Milestones",
    description: "Celebrate your consistency streaks",
    icon: "🔥",
    canDisable: true,
  },
  {
    key: "subscription_update",
    title: "Subscription Updates",
    description: "Important updates about your subscription",
    icon: "💳",
    canDisable: true,
  },
  {
    key: "system_update",
    title: "System Updates",
    description: "Critical app updates and maintenance notices",
    icon: "🔧",
    canDisable: false,
  },
  {
    key: "security_alert",
    title: "Security Alerts",
    description: "Important security notifications and alerts",
    icon: "🔒",
    canDisable: false,
  },
];

// Loading skeleton component
function NotificationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global settings skeleton */}
        <div className="space-y-4 pb-4 border-b">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-11" />
            </div>
          ))}
        </div>

        {/* Notification types skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-start space-x-3 flex-1">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-11" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main component
export function NotificationSettings() {
  const { preferences, updatePreferences, sendTestNotification } =
    useNotifications();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  if (!preferences) {
    return <NotificationSkeleton />;
  }

  const handleToggle = async (key: string, value: boolean) => {
    // Prevent disabling critical notifications
    if ((key === "system_update" || key === "security_alert") && !value) {
      toast.error(
        "This notification type cannot be disabled for security reasons"
      );
      return;
    }

    if (key === "push_notifications" && value) {
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        toast.error("Please allow notifications in your browser");
        return;
      }
    }

    setSaving(true);
    try {
      await updatePreferences({ [key]: value });
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    setTesting(true);
    try {
      await sendTestNotification();
    } finally {
      setTesting(false);
    }
  };

  const GlobalSettingItem = ({
    settingKey,
    title,
    description,
  }: {
    settingKey: string;
    title: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label className="text-base font-medium">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={preferences[settingKey as keyof typeof preferences] as boolean}
        onCheckedChange={(checked) => handleToggle(settingKey, checked)}
        disabled={saving}
      />
    </div>
  );

  const NotificationTypeItem = ({
    type,
  }: {
    type: (typeof NOTIFICATION_TYPES)[0];
  }) => (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start space-x-3 flex-1">
        <span className="text-lg">{type.icon}</span>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">{type.title}</Label>
            {!type.canDisable && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Required
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{type.description}</p>
        </div>
      </div>
      <Switch
        checked={preferences[type.key as keyof typeof preferences] as boolean}
        onCheckedChange={(checked) => handleToggle(type.key, checked)}
        disabled={saving || !type.canDisable}
      />
    </div>
  );

  // Split notification types into two columns for better organization
  const firstColumnTypes = NOTIFICATION_TYPES.slice(
    0,
    Math.ceil(NOTIFICATION_TYPES.length / 2)
  );
  const secondColumnTypes = NOTIFICATION_TYPES.slice(
    Math.ceil(NOTIFICATION_TYPES.length / 2)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Control which notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global notification settings */}
        <div className="space-y-4 pb-4 border-b">
          <GlobalSettingItem
            settingKey="email_notifications"
            title="Email Notifications"
            description="Receive notifications via email"
          />
          <GlobalSettingItem
            settingKey="push_notifications"
            title="Push Notifications"
            description="Receive push notifications in the app"
          />

          {/* Test Notification Button */}
          {preferences.push_notifications && (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">
                  Test Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Send a test notification to verify your device notifications
                  are working
                </p>
              </div>
              <Button
                onClick={handleTestNotification}
                disabled={testing || saving}
                variant="outline"
                size="sm"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Test Now
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Individual notification types */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Notification Types
          </h4>

          {/* Mobile: Single column */}
          <div className="block lg:hidden space-y-3">
            {NOTIFICATION_TYPES.map((type) => (
              <NotificationTypeItem key={type.key} type={type} />
            ))}
          </div>

          {/* Desktop: Two columns with separator */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8">
            {/* First Column */}
            <div className="space-y-3">
              {firstColumnTypes.map((type) => (
                <NotificationTypeItem key={type.key} type={type} />
              ))}
            </div>

            {/* Vertical Separator */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border -ml-4"></div>
              <div className="space-y-3">
                {secondColumnTypes.map((type) => (
                  <NotificationTypeItem key={type.key} type={type} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Information note */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Important Note</p>
              <p className="text-xs text-muted-foreground">
                System updates and security alerts cannot be disabled to ensure
                your account safety and app functionality.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
