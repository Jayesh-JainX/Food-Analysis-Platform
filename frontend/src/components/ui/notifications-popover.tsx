import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "@/components/ui/notification";
import { useNotifications } from "@/hooks/use-notifications";
import { Badge } from "@/components/ui/badge";

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    hasMore,
    markAsRead,
    markAllAsRead,
    fetchMoreNotifications,
  } = useNotifications();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    // Optionally close the popover after marking all as read
    // setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[90vw] max-w-[400px] p-0"
        align="end"
        sideOffset={8}
      >
        <div className="p-3 sm:p-4">
          <NotificationList
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={fetchMoreNotifications}
            onClose={handleClose}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
