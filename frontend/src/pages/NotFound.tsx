import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/shared/SEO";
import { Button } from "@/components/ui/button";
import { Rabbit, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  // Add custom bounce animation styles
  const customBounceStyle = `
    @keyframes customBounce {
      0% {
        transform: translateY(0) scale(1);
      }
      25% {
        transform: translateY(-15px) scale(1.05);
      }
      50% {
        transform: translateY(-25px) scale(1.1);
      }
      75% {
        transform: translateY(-10px) scale(1.05);
      }
      100% {
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      25% {
        transform: translateY(-5px) rotate(2deg);
      }
      50% {
        transform: translateY(-10px) rotate(0deg);
      }
      75% {
        transform: translateY(-5px) rotate(-2deg);
      }
    }
    
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(var(--primary), 0.3);
      }
      50% {
        box-shadow: 0 0 40px rgba(var(--primary), 0.6);
      }
    }
  `;
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <style>{customBounceStyle}</style>
      <SEO
        title="Page Not Found - Wellness AI Lens"
        description="The page you are looking for could not be found. Please check the URL or return to our homepage."
        keywords="404, page not found, error page, missing page"
      />

      {/* Background with gradient */}
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="text-center max-w-2xl mx-auto">
            {/* Rabbit Icon */}
            <div className="mb-10 flex justify-center">
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-full blur-2xl animate-pulse"></div>

                {/* Main container with glow animation */}
                <div
                  className="relative bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-12 rounded-full border-2 border-primary/30 shadow-2xl backdrop-blur-sm"
                  style={{ animation: "glow 3s ease-in-out infinite" }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-lg"></div>

                  {/* Rabbit with enhanced animation */}
                  <div className="relative">
                    <Rabbit
                      className="w-32 h-32 text-primary drop-shadow-lg"
                      style={{
                        animation:
                          "customBounce 2.5s ease-in-out infinite, float 4s ease-in-out infinite",
                      }}
                    />
                  </div>
                </div>

                {/* Floating particles around rabbit */}
                <div className="absolute -top-4 -left-4 w-3 h-3 bg-primary/40 rounded-full animate-ping"></div>
                <div
                  className="absolute -top-2 -right-6 w-2 h-2 bg-secondary/50 rounded-full animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute -bottom-6 -left-2 w-2 h-2 bg-accent/60 rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute -bottom-4 -right-4 w-3 h-3 bg-primary/30 rounded-full animate-ping"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>
            </div>

            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-none drop-shadow-lg">
                404
              </h1>
            </div>

            {/* Main heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 drop-shadow-sm">
              Oops! Page Not Found
            </h2>

            {/* Description */}
            <p className="text-base text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              The page you're looking for seems to have hopped away like our
              friendly rabbit. Don't worry, you can always find your way back to
              healthy eating!
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-secondary/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-accent/40 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-primary/20 rounded-full animate-pulse delay-1500"></div>
      </div>
    </>
  );
};

export default NotFound;
