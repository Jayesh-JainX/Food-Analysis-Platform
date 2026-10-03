import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  requestNotificationPermission,
  showDeviceNotification,
} from "@/utils/notifications";
import type { Notification as DatabaseNotification } from "@/integrations/supabase/database-types";

export type NotificationType =
  | "food_scan_low_score"
  | "welcome"
  | "achievement"
  | "health_update"
  | "nutrition_reminder"
  | "system_update"
  | "security_alert"
  | "subscription_update"
  | "daily_summary"
  | "goal_reached"
  | "streak_milestone";
export type NotificationPriority = "low" | "medium" | "high" | "critical";

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  priority?: "low" | "medium" | "high" | "critical";
  actionUrl?: string;
  data?: any;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  food_scan_low_score: boolean;
  welcome: boolean;
  achievement: boolean;
  health_update: boolean;
  nutrition_reminder: boolean;
  system_update: boolean;
  security_alert: boolean;
  subscription_update: boolean;
  daily_summary: boolean;
  goal_reached: boolean;
  streak_milestone: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

const NOTIFICATIONS_PER_PAGE = 15;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [lastFetchedDate, setLastFetchedDate] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const { user } = useAuth();

  const sendDeviceNotification = async (notification: Notification) => {
    if (!user || !preferences) return;

    // Check if user has enabled push notifications
    if (!preferences.push_notifications) return;

    // Request permission if not already granted
    const permission = await requestNotificationPermission();
    if (permission !== "granted") return;

    try {
      // Determine icon based on notification type and priority
      const getNotificationIcon = () => {
        if (notification.priority === "critical")
          return "/icons/icon-192x192.png";
        if (notification.priority === "high") return "/icons/icon-152x152.png";
        switch (notification.type) {
          case "success":
            return "/icons/icon-144x144.png";
          case "warning":
            return "/icons/icon-128x128.png";
          case "error":
            return "/icons/icon-96x96.png";
          default:
            return "/icon.png";
        }
      };

      // Send device notification
      await showDeviceNotification(notification.title, {
        body: notification.description,
        icon: getNotificationIcon(),
        tag: `notification-${notification.id}`,
        url: notification.actionUrl || "/dashboard",
        badge: "/icons/icon-96x96.png",
        data: {
          notificationId: notification.id,
          url: notification.actionUrl || "/dashboard",
          timestamp: notification.timestamp.toISOString(),
        },
        requireInteraction: notification.priority === "critical",
        silent: notification.priority === "low",
      });
    } catch (error) {
      console.error("Failed to send device notification:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchPreferences();
      setupRealtimeSubscription();

      // Request notification permission on first load if user has push notifications enabled
      if (preferences?.push_notifications) {
        requestNotificationPermission().catch(console.error);
      }
    } else {
      setNotifications([]);
      setPreferences(null);
      setLoading(false);
    }
  }, [user, preferences?.push_notifications]);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const newNotification = transformDatabaseNotification(
            payload.new as DatabaseNotification
          );
          setNotifications((prev) => [newNotification, ...prev]);

          // Show toast for high priority notifications
          if (
            payload.new.priority === "high" ||
            payload.new.priority === "critical"
          ) {
            toast[getToastType(payload.new.type)](payload.new.title, {
              description: payload.new.description,
            });
          }

          // Send device notification for all new notifications if user has enabled push notifications
          await sendDeviceNotification(newNotification);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const fetchNotifications = async (isLoadMore = false) => {
    if (!user) return;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .or("expires_at.is.null,expires_at.gt.now()")
        .order("created_at", { ascending: false })
        .limit(NOTIFICATIONS_PER_PAGE);

      // Apply pagination
      if (isLoadMore && lastFetchedDate) {
        query = query.lt("created_at", lastFetchedDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedNotifications = data.map(transformDatabaseNotification);

      if (isLoadMore) {
        setNotifications((prev) => [...prev, ...transformedNotifications]);
      } else {
        setNotifications(transformedNotifications);
      }

      // Update pagination state
      if (data && data.length > 0) {
        setLastFetchedDate(data[data.length - 1].created_at);
        setHasMore(data.length === NOTIFICATIONS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Enhanced refresh function that fetches latest notifications
  const refresh = async () => {
    if (!user) return;

    try {
      // Fetch the latest notifications (first page)
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .or("expires_at.is.null,expires_at.gt.now()")
        .order("created_at", { ascending: false })
        .limit(NOTIFICATIONS_PER_PAGE);

      if (error) throw error;

      const transformedNotifications = data.map(transformDatabaseNotification);

      // Update notifications with latest data
      setNotifications(transformedNotifications);

      // Update pagination state
      if (data && data.length > 0) {
        setLastFetchedDate(data[data.length - 1].created_at);
        setHasMore(data.length === NOTIFICATIONS_PER_PAGE);
      } else {
        setHasMore(false);
      }

      // Update last refresh time
      setLastRefreshTime(new Date());
    } catch (error) {
      console.error("Error refreshing notifications:", error);
      // Don't show toast for refresh errors to avoid spam
    }
  };

  // Function to fetch only new notifications since last refresh
  const fetchNewNotifications = async () => {
    if (!user || !lastRefreshTime) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .or("expires_at.is.null,expires_at.gt.now()")
        .gt("created_at", lastRefreshTime.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const newNotifications = data.map(transformDatabaseNotification);
        setNotifications((prev) => [...newNotifications, ...prev]);

        // Update last refresh time
        setLastRefreshTime(new Date());
      }
    } catch (error) {
      console.error("Error fetching new notifications:", error);
    }
  };

  const fetchMoreNotifications = () => {
    if (!loadingMore && hasMore) {
      fetchNotifications(true);
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      // First, try to get existing preferences
      let { data: preferences, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Handle different error scenarios
      if (error) {
        if (error.code === "PGRST116") {
          // No rows found - create new preferences
          const { data: newPreferences, error: insertError } = await supabase
            .from("notification_preferences")
            .insert({
              user_id: user.id,
              food_scan_low_score: true,
              welcome: true,
              achievement: true,
              health_update: true,
              nutrition_reminder: true,
              system_update: true,
              security_alert: true,
              subscription_update: true,
              daily_summary: true,
              goal_reached: true,
              streak_milestone: true,
              email_notifications: true,
              push_notifications: true,
            })
            .select()
            .single();

          if (insertError) {
            if (insertError.code === "23505") {
              // Duplicate key - someone else created it, fetch again
              const { data: existingPrefs, error: fetchError } = await supabase
                .from("notification_preferences")
                .select("*")
                .eq("user_id", user.id)
                .single();

              if (fetchError) {
                console.error(
                  "Error fetching existing preferences:",
                  fetchError
                );
                return;
              }
              preferences = existingPrefs;
            } else {
              console.error("Error creating preferences:", insertError);
              return;
            }
          } else {
            preferences = newPreferences;
          }
        } else {
          console.error("Error fetching notification preferences:", error);
          return;
        }
      }

      setPreferences(preferences);
    } catch (error) {
      console.error("Error in fetchPreferences:", error);
      // Don't throw - handle gracefully with default state
      setPreferences(null);
    }
  };

  const updatePreferences = async (
    updates: Partial<NotificationPreferences>
  ) => {
    if (!user || !preferences) return;

    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      toast.success("Notification preferences updated");
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast.error("Failed to update preferences");
    }
  };

  const transformDatabaseNotification = (
    dbNotification: DatabaseNotification
  ): Notification => ({
    id: dbNotification.id,
    title: dbNotification.title,
    description: dbNotification.description,
    timestamp: new Date(dbNotification.created_at),
    read: dbNotification.read,
    type: getNotificationUIType(dbNotification.type),
    priority: dbNotification.priority,
    actionUrl: dbNotification.action_url,
    data: dbNotification.data,
  });

  const getNotificationUIType = (
    type: NotificationType
  ): "info" | "success" | "warning" | "error" => {
    switch (type) {
      case "welcome":
      case "achievement":
      case "goal_reached":
      case "streak_milestone":
      case "daily_summary":
      case "nutrition_reminder":
      case "health_update":
      case "subscription_update":
      case "system_update":
        return "info";
      case "food_scan_low_score":
        return "warning";
      case "security_alert":
        return "error";
      default:
        return "info";
    }
  };

  const getToastType = (
    type: NotificationType
  ): "info" | "success" | "warning" | "error" => {
    return getNotificationUIType(type);
  };

  const createNotification = async (
    title: string,
    description: string,
    type: NotificationType,
    priority: NotificationPriority = "medium",
    notificationData: any = {},
    actionUrl?: string
  ) => {
    if (!user) return;

    try {
      const { data: result, error } = await supabase.rpc(
        "create_notification",
        {
          p_user_id: user.id,
          p_title: title,
          p_description: description,
          p_type: type,
          p_priority: priority,
          p_data: notificationData,
          p_action_url: actionUrl,
        }
      );

      if (error) throw error;
      return result;
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user?.id)
        .eq("read", false);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const sendTestNotification = async () => {
    if (!user) return false;

    try {
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        toast.error("Please enable notifications in your browser settings");
        return false;
      }

      const testNotification: Notification = {
        id: `test-${Date.now()}`,
        title: "Test Notification",
        description:
          "This is a test notification to verify your device notifications are working properly.",
        timestamp: new Date(),
        read: false,
        type: "info",
        priority: "medium",
        actionUrl: "/dashboard",
        data: { test: true },
      };

      await sendDeviceNotification(testNotification);
      toast.success("Test notification sent! Check your device notifications.");
      return true;
    } catch (error) {
      console.error("Failed to send test notification:", error);
      toast.error("Failed to send test notification");
      return false;
    }
  };

  return {
    notifications,
    loading,
    loadingMore,
    hasMore,
    unreadCount,
    preferences,
    refresh,
    fetchMoreNotifications,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    fetchNewNotifications,
    sendTestNotification, // New function for testing device notifications
  };
}
