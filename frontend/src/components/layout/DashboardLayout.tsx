import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@/components/shared/Header";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLayout() {
  const { user, loading } = useAuth();
  const { dashboardLayout } = useAppContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access this page");
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1">
        {!isMobile && (
          <aside className="hidden md:block w-[240px] shrink-0 border-r h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto bg-sidebar">
            <DashboardNavigation />
          </aside>
        )}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${getLayoutClasses(
            dashboardLayout
          )}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 border-b px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="hidden md:block w-[240px] border-r">
          <div className="p-4 space-y-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
          </div>
        </div>
        <main className="flex-1 p-4 md:p-6">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function getLayoutClasses(layout: { style: string; cardSize: string }) {
  const classes: string[] = [];

  // Layout style classes with padding
  switch (layout.style) {
    case "compact":
      classes.push("max-w-5xl mx-auto p-4 md:p-6 layout-compact");
      break;
    case "detailed":
      classes.push("max-w-7xl mx-auto p-4 md:p-6 layout-detailed");
      break;
    case "standard":
    default:
      classes.push("max-w-6xl mx-auto p-4 md:p-6 layout-standard");
  }

  // Card size classes (we'll use CSS variables that will be applied to card components)
  switch (layout.cardSize) {
    case "small":
      classes.push("dashboard-card-small");
      break;
    case "large":
      classes.push("dashboard-card-large");
      break;
    case "medium":
    default:
      classes.push("dashboard-card-medium");
  }

  return classes.join(" ");
}
