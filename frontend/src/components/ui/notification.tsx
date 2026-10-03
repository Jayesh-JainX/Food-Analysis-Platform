import { formatDistanceToNow } from "date-fns";
import { Bell, Check, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useCallback, useEffect } from "react";

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

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onClose?: () => void;
}

// Skeleton component for loading state
function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg border">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-3 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-14" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for loading more notifications
function LoadingMoreSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="p-3 rounded-lg border">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-3 w-full" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-14" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  onClose,
}: NotificationListProps) {
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer callback for infinite loading
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore || !hasMore || !onLoadMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            onLoadMore();
          }
        },
        {
          rootMargin: "50px",
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, onLoadMore]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const getTypeColor = (type: string) => {
    const colors = {
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      error: "text-red-600 dark:text-red-400",
      info: "text-blue-600 dark:text-blue-400",
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getPriorityBadge = (priority?: string) => {
    const badges = {
      critical: (
        <Badge variant="destructive" className="text-xs">
          Critical
        </Badge>
      ),
      high: (
        <Badge
          variant="secondary"
          className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        >
          High
        </Badge>
      ),
      medium: (
        <Badge variant="outline" className="text-xs">
          Medium
        </Badge>
      ),
      low: (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Low
        </Badge>
      ),
    };
    return badges[priority as keyof typeof badges] || null;
  };

  const getValidRoute = (actionUrl?: string): string => {
    if (!actionUrl) return "/dashboard";

    // Map common action URLs to valid routes
    const routeMap: Record<string, string> = {
      "/food-scans": "/scan-history",
      "/dashboard": "/dashboard",
      "/profile": "/profile",
      "/settings": "/settings",
      "/analytics": "/analytics",
      "/nutrition": "/nutrition",
      "/scanner": "/scanner",
    };

    // Check if the actionUrl is in our route map
    if (routeMap[actionUrl]) {
      return routeMap[actionUrl];
    }

    // Check if it's a valid route pattern
    const validRoutes = [
      "/dashboard",
      "/scanner",
      "/scan-history",
      "/profile",
      "/analytics",
      "/nutrition",
      "/settings",
    ];

    // Check for dynamic routes like /scan/:id
    if (actionUrl.startsWith("/scan/") && actionUrl.length > 6) {
      return actionUrl;
    }

    // If actionUrl matches a valid route, return it
    if (validRoutes.includes(actionUrl)) {
      return actionUrl;
    }

    // Default fallback
    return "/dashboard";
  };

  const handleNotificationClick = (
    notification: Notification,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    // Mark as read when clicked
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }

    // Close the notification dropdown first
    if (onClose) {
      onClose();
    }

    // Navigate to the route after a small delay to ensure dropdown closes
    setTimeout(() => {
      navigate(getValidRoute(notification.actionUrl));
    }, 100);
  };

  if (loading) {
    return <NotificationSkeleton />;
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <h3 className="text-base font-medium text-muted-foreground mb-1">
          No notifications yet
        </h3>
        <p className="text-xs text-muted-foreground">
          You'll see important updates and alerts here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm sm:text-base">
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs hover:bg-muted h-6 sm:h-7 px-2 sm:px-3"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Mark all read</span>
              <span className="sm:hidden">All read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[300px] sm:h-[350px] pr-2">
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              ref={index === notifications.length - 1 ? lastElementRef : null}
              className={cn(
                "group relative rounded-md border transition-all duration-200 hover:shadow-sm cursor-pointer",
                notification.read
                  ? "bg-muted/30 border-border"
                  : "bg-background border-primary/20 shadow-sm"
              )}
            >
              {/* Clickable notification content */}
              <div
                onClick={(e) => handleNotificationClick(notification, e)}
                className="block p-2.5 sm:p-3 hover:bg-muted/50 transition-colors rounded-md"
              >
                <div className="flex items-start gap-2">
                  {/* Priority indicator */}
                  {!notification.read && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Title and Priority Badge */}
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={cn(
                          "font-medium text-sm truncate",
                          !notification.read && "font-semibold"
                        )}
                      >
                        {notification.title}
                      </h4>
                      {/* {getPriorityBadge(notification.priority)} */}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2 leading-relaxed">
                      {notification.description}
                    </p>

                    {/* Timestamp */}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        getTypeColor(notification.type)
                      )}
                    >
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-background"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    title="Mark as read"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="py-2">
              <LoadingMoreSkeleton />
            </div>
          )}

          {/* End of results indicator */}
          {!hasMore && notifications.length > 0 && (
            <div className="text-center py-3 text-muted-foreground text-xs">
              No more notifications
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
