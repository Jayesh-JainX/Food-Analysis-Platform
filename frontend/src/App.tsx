import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { useEffect } from "react";
import {
  registerServiceWorker,
  requestNotificationPermission,
} from "./utils/notifications";

// Pages
import Index from "./pages/Index";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ScannerPage from "./pages/ScannerPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import InterestsPage from "./pages/InterestsPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";

// import PricingPage from "./pages/PricingPage";
import NutritionPage from "./pages/NutritionPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";
import SettingsPage from "./pages/SettingsPage";
import ScanDetailPage from "./pages/ScanDetailPage";
import ExercisePage from "./pages/ExercisePage";
import ExerciseDetailPage from "./pages/ExerciseDetailPage";
import ComingSoonAIChat from "./pages/ComingSoonAIChat";
import ComingSoonMedicine from "./pages/ComingSoonMedicine";
import ComingSoonGoalPlanner from "./pages/ComingSoonGoalPlanner";
import GoalPlannerPage from "./pages/GoalPlannerPage";
import DiseasesPage from "./pages/DiseasesPage";

// Layouts
import { DashboardLayout } from "./components/layout/DashboardLayout";
import AnalyticsPage from "./pages/AnalyticsPage";
import { ScanHistoryPage } from "./pages/scanhistorypage";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { NonFoodImageError } from "./components/scanner/components/NonFoodImageError";
import ResetPassword from "./components/reset_password/ResetPassword";
import AuthCallbackPage from "./pages/AuthCallbackPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.title = "Wellness AI Lens";
  }, []);

  // Listen for messages from service worker (notification clicks)
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "NAVIGATE_TO") {
        const { url } = event.data.payload;
        if (url) {
          // Use React Router to navigate
          window.location.href = url;
        }
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );

      return () => {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      };
    }
  }, []);

  useEffect(() => {
    (async () => {
      await registerServiceWorker();
      if (
        typeof Notification !== "undefined" &&
        Notification.permission !== "granted"
      ) {
        await requestNotificationPermission();
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppProvider>
              <Toaster />
              <Sonner />
              <ScrollToTop>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  {/* <Route path="/pricing" element={<PricingPage />} /> */}
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />

                  {/* New User Onboarding */}
                  <Route
                    path="/interests"
                    element={
                      <RequireAuth>
                        <InterestsPage />
                      </RequireAuth>
                    }
                  />

                  {/* Protected Routes - Using DashboardLayout */}
                  <Route
                    element={
                      <RequireAuth>
                        <DashboardLayout />
                      </RequireAuth>
                    }
                  >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/scanner" element={<ScannerPage />} />
                    <Route
                      path="/non-food-error"
                      element={<NonFoodImageError />}
                    />
                    <Route path="/scan-history" element={<ScanHistoryPage />} />
                    <Route path="/scan/:id" element={<ScanDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/nutrition" element={<NutritionPage />} />
                    <Route path="/exercise" element={<ExercisePage />} />
                    <Route
                      path="/exercise/:id"
                      element={<ExerciseDetailPage />}
                    />
                    <Route path="/ai-chat" element={<ComingSoonAIChat />} />
                    <Route path="/medicine" element={<ComingSoonMedicine />} />
                    <Route path="/diseases" element={<DiseasesPage />} />
                    <Route path="/goal-planner" element={<GoalPlannerPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>

                  {/* Catch-all Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ScrollToTop>
            </AppProvider>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
