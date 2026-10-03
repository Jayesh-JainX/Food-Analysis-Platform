import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RecentScans } from "@/components/dashboard/RecentScans";
import { NutritionSummary } from "@/components/shared/NutritionSummary";
import { HealthInsights } from "@/components/dashboard/HealthInsights";
import { useEffect, useState } from "react";
import { NutritionMeal } from "@/integrations/supabase/database-types";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setIsLoading } = useAppContext();
  const [meals, setMeals] = useState<NutritionMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (user) {
      fetchMeals();
    }
  }, [user, selectedDate]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setIsLoading(true);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("nutrition_meals")
        .select("*")
        .eq("user_id", user?.id)
        .gte("consumed_at", startOfDay.toISOString())
        .lte("consumed_at", endOfDay.toISOString())
        .order("consumed_at", { ascending: true });

      if (error) throw error;

      setMeals(data || []);
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("Failed to load meals");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const [nutritionTargets, setNutritionTargets] = useState(null);

  useEffect(() => {
    if (user) {
      fetchNutritionTargets();
    }
  }, [user]);

  const fetchNutritionTargets = async () => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          "daily_calories_target, daily_protein_target, daily_carbs_target, daily_fat_target, daily_fiber_target, daily_sugar_limit"
        )
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setNutritionTargets(profile);
    } catch (error) {
      console.error("Error fetching nutrition targets:", error);
      toast.error("Failed to load nutrition targets");
    }
  };

  // Calculate daily nutrition totals
  const dailyNutrition = {
    calories: meals.reduce((sum, meal) => sum + meal.calories, 0),
    protein: meals.reduce((sum, meal) => sum + meal.protein, 0),
    carbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
    fat: meals.reduce((sum, meal) => sum + meal.fat, 0),
    fiber: meals.reduce((sum, meal) => sum + (meal.fiber || 0), 0),
    sugar: meals.reduce((sum, meal) => sum + (meal.sugar || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your nutrition and wellness journey
          </p>
        </div>
        <Button
          className="wellness-gradient"
          onClick={() => navigate("/scanner")}
        >
          <Camera className="mr-2 h-4 w-4" />
          Scan Food
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <HealthInsights />
            <RecentScans />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <NutritionSummary
              nutrition={dailyNutrition}
              targets={nutritionTargets}
            />
            <HealthInsights showRecommendationsOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
