import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  BarChart3,
  Camera,
  Brain,
  Apple,
  Utensils,
} from "lucide-react";
import { Header } from "@/components/shared/Header";
import { SEO } from "@/components/shared/SEO";

export default function LandingPage() {
  const navigate = useNavigate();

  // Feature list with icons
  const features = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "AI-Powered Food Scanner",
      description:
        "Scan food labels instantly to get detailed nutritional information and insights",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Nutrition Analytics",
      description:
        "Track your nutritional intake and visualize your dietary patterns",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Smart Recommendations",
      description:
        "Get personalized food suggestions based on your preferences and goals",
    },
    {
      icon: <Apple className="h-6 w-6" />,
      title: "Food Database",
      description:
        "Access a comprehensive database of foods with detailed nutritional information",
    },
    {
      icon: <Utensils className="h-6 w-6" />,
      title: "Meal Planning",
      description:
        "Plan your meals with smart suggestions for balanced nutrition",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy First",
      description:
        "Your food and nutrition data is secure and never shared without your permission",
    },
  ];

  return (
    <>
      <SEO
        title="AI-Powered Food Analysis"
        description="Analyze food labels instantly with our AI-powered scanner. Get detailed nutritional information, health scores, and personalized recommendations."
        keywords="food analysis, AI scanner, nutrition facts, health score, food tracking, dietary analysis, allergen detection"
      />
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header showNavigation={false} />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-20 md:py-32 bg-gradient-to-b from-background to-muted/50">
          <div className="container relative z-10 flex flex-col items-center text-center">
            <h1 className="max-w-4xl text-3xl sm:text-4xl font-bold md:text-6xl lg:text-7xl">
              Your Personal AI-Powered
              <span className="text-primary block md:inline">
                {" "}
                Food Analysis Assistant
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground px-4 sm:px-0">
              Scan food labels, analyze nutritional content, and receive
              personalized dietary recommendations. All powered by advanced AI
              to help you make better food choices.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0">
              <Button
                size="lg"
                className="wellness-gradient"
                onClick={() => navigate("/signup")}
              >
                Start Your Food Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/scanner")}
              >
                Try Scanner Demo
              </Button>
            </div>
          </div>

          {/* Hero pattern background */}
          <div className="absolute right-0 top-0 -z-10 h-full w-full hero-mask">
            <div className="absolute right-[-10%] top-[-5%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute left-[-10%] top-[30%] h-[400px] w-[400px] rounded-full bg-secondary/20 blur-3xl"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">
                Powerful Food Analysis Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform offers a comprehensive suite of tools to help you
                understand and improve your nutrition
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 sm:p-6 border rounded-xl bg-background card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="feature-icon mb-4 self-start">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold">
                Ready to Transform Your Food Choices?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of users who have already improved their
                nutrition with our AI-powered platform
              </p>
              <Button
                size="lg"
                className="wellness-gradient mt-8"
                onClick={() => navigate("/signup")}
              >
                Get Started for Free
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8">
          <div className="container flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-semibold">
                <span className="text-primary">Wellness</span> AI Lens
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                © 2025 All rights reserved
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
