import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/shared/Header";

const interests = [
  { id: "nutrition", label: "Nutrition" },
  { id: "fitness", label: "Fitness" },
  { id: "mental-health", label: "Mental Health" },
  { id: "weight-loss", label: "Weight Loss" },
  { id: "allergens", label: "Food Allergies" },
  { id: "diet", label: "Special Diets" },
  { id: "supplements", label: "Supplements" },
  { id: "sleep", label: "Sleep Health" },
  { id: "cooking", label: "Healthy Cooking" },
];

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check if interests are already set
    const checkInterests = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("interests, onboarded")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking profile:", error);
          return;
        }

        // If already onboarded, redirect to dashboard
        if (data && data.onboarded) {
          navigate("/dashboard");
        }

        // If interests already set, pre-select them
        if (data && data.interests && data.interests.length > 0) {
          setSelectedInterests(data.interests);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkInterests();
  }, [user, navigate]);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          interests: selectedInterests,
          onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Preferences saved successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving interests:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating onboarding status:", error);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Tell us about your interests
            </h1>
            <p className="text-muted-foreground">
              Select topics you're interested in to personalize your wellness
              journey
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {interests.map((interest) => (
                  <div
                    key={interest.id}
                    className={`
                      border rounded-lg p-4 flex items-start gap-3 cursor-pointer
                      ${
                        selectedInterests.includes(interest.id)
                          ? "border-primary bg-primary/5"
                          : ""
                      }
                    `}
                    onClick={() => handleInterestToggle(interest.id)}
                  >
                    <Checkbox
                      checked={selectedInterests.includes(interest.id)}
                      onCheckedChange={() => handleInterestToggle(interest.id)}
                    />
                    <div>
                      <div className="font-medium">{interest.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handleSkip}>
                  Skip for now
                </Button>
                <Button
                  className="wellness-gradient"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
