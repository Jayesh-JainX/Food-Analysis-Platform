import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  BarChart,
  Utensils,
  User,
  Settings,
  History,
  LogOut,
  Activity,
  MessageCircle,
  Pill,
  Target,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

interface LogoutButtonProps {
  onClick?: () => void;
}

interface DashboardNavigationProps {
  onNavItemClick?: () => void;
}

function NavItem({ to, icon, label, active, onClick }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function LogoutButton({ onClick }: LogoutButtonProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/signin");
      onClick?.(); // Close mobile sidebar if open
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 px-3 py-2 h-auto text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 " />
      <span>Sign Out</span>
    </Button>
  );
}

export function DashboardNavigation({
  onNavItemClick,
}: DashboardNavigationProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to check if a nav item should be active
  const isNavItemActive = (navPath: string) => {
    if (navPath === "/scan-history") {
      // Make scan history active for scan-history, individual scan pages, and non-food-error
      return (
        currentPath === "/scan-history" ||
        currentPath.startsWith("/scan/") ||
        currentPath === "/non-food-error"
      );
    }
    if (navPath === "/exercise") {
      // Make exercise active for /exercise and /exercise/:id routes
      return (
        currentPath === "/exercise" || currentPath.startsWith("/exercise/")
      );
    }
    return currentPath === navPath;
  };

  const navItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "My Dashboard",
    },
    {
      to: "/scanner",
      icon: <Camera className="h-4 w-4" />,
      label: "Scan Food",
    },
    {
      to: "/scan-history",
      icon: <History className="h-4 w-4" />,
      label: "My Scans",
    },
    {
      to: "/analytics",
      icon: <BarChart className="h-4 w-4" />,
      label: "Health Insights",
    },
    {
      to: "/nutrition",
      icon: <Utensils className="h-4 w-4" />,
      label: "My Meals",
    },
    {
      to: "/exercise",
      icon: <Activity className="h-4 w-4" />,
      label: "Workout Now",
    },
    // {
    //   to: "/ai-chat",
    //   icon: <MessageCircle className="h-4 w-4" />,
    //   label: "Ask Health AI",
    // },
    // {
    //   to: "/medicine",
    //   icon: <Pill className="h-4 w-4" />,
    //   label: "Medicine Guide",
    // },
    {
      to: "/diseases",
      icon: <Stethoscope className="h-4 w-4" />,
      label: "Disease Finder",
    },
    {
      to: "/goal-planner",
      icon: <Target className="h-4 w-4" />,
      label: "Set Goals",
    },
    {
      to: "/profile",
      icon: <User className="h-4 w-4" />,
      label: "My Profile",
    },
    {
      to: "/settings",
      icon: <Settings className="h-4 w-4" />,
      label: "App Settings",
    },
  ];

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={isNavItemActive(item.to)}
            onClick={onNavItemClick}
          />
        ))}
      </div>

      <div className="p-4 pt-0">
        <Separator className="mb-4" />
        <LogoutButton onClick={onNavItemClick} />
      </div>
    </nav>
  );
}
