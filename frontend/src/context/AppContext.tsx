import React, { createContext, useContext, useEffect, useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { useLocation } from "react-router-dom";

interface AppContextType {
  dashboardLayout: {
    style: "standard" | "compact" | "detailed";
    cardSize: "small" | "medium" | "large";
  };
  updateDashboardLayout: (
    updates: Partial<AppContextType["dashboardLayout"]>
  ) => void;
  isLoading?: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState({
    style: "standard" as const,
    cardSize: "medium" as const,
  });
  const location = useLocation();
  const { addNotification } = useNotifications();

  // Handle route changes
  useEffect(() => {
    // Announce page change for accessibility
    if (location.pathname) {
      const pageName = location.pathname.split("/").pop() || "home";
      document.title = `${
        pageName.charAt(0).toUpperCase() + pageName.slice(1)
      } - Wellness AI Lens`;
    }
  }, [location.pathname]);

  const updateDashboardLayout = (updates: Partial<typeof dashboardLayout>) => {
    setDashboardLayout((prev) => ({
      ...prev,
      ...updates,
    }));

    // Save to localStorage
    localStorage.setItem(
      "dashboardLayout",
      JSON.stringify({
        ...dashboardLayout,
        ...updates,
      })
    );
  };

  // Load saved settings from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem("dashboardLayout");
    if (savedLayout) {
      try {
        setDashboardLayout(JSON.parse(savedLayout));
      } catch (e) {
        console.error("Failed to parse saved dashboard layout:", e);
      }
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        dashboardLayout,
        updateDashboardLayout,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
