import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import NextTopLoader from "nextjs-toploader";
import { inject } from "@vercel/analytics";
import { registerServiceWorker } from "./utils/notifications.ts";

// Handle CJS / ESM module resolution differences for NextTopLoader in Vite
const TopLoader =
  typeof NextTopLoader === "function"
    ? NextTopLoader
    : ((NextTopLoader as any)?.default as typeof NextTopLoader) ||
      NextTopLoader;

// Register service worker for notifications
registerServiceWorker()
  .then((registration) => {
    if (registration) {
      console.log("Service worker registered successfully for notifications");
    }
  })
  .catch((error) => {
    console.error("Service worker registration failed:", error);
  });

// Filter function to ignore dynamic scan routes for analytics
const shouldTrack = (url: string) => {
  // Ignore routes that match /scan/ followed by any dynamic segment
  const scanRoutePattern = /^\/scan\/[^\/]+$/;
  return !scanRoutePattern.test(url);
};

inject({
  mode: "production",
  beforeSend: (event) => {
    // Filter out dynamic scan routes from analytics
    if (event.url && shouldTrack(event.url)) {
      return event;
    }
    return null; // Don't send events for filtered routes
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system">
    {TopLoader && (
      <TopLoader
        color="#5a7460"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={true}
        easing="ease"
        speed={200}
        shadow="0 0 10px #5a7460, 0 0 5px #5a7460"
        template={`
      <div class="bar" role="bar">
        <div class="peg"></div>
      </div>
      <div class="spinner" role="spinner">
        <div class="spinner-icon"></div>
      </div>
    `}
        zIndex={1600}
        showAtBottom={false}
      />
    )}
    <App />
  </ThemeProvider>
);
