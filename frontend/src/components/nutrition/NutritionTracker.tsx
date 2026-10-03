import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { NutritionMeal } from "@/integrations/supabase/database-types";
import { NutritionSummary } from "../shared/NutritionSummary";
import { MealList } from "./MealList";
import { AddMealDialog } from "./AddMealDialog";
import { useNotifications } from "@/hooks/use-notifications";
import { useAppContext } from "@/context/AppContext";
import { EnhancedDateRangePicker } from "./EnhancedDateRangePicker";
import { DateRange } from "react-day-picker";

export function NutritionTracker() {
  const { user } = useAuth();
  const { setIsLoading } = useAppContext();
  const [meals, setMeals] = useState<NutritionMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      from: today,
      to: today,
    };
  });

  useEffect(() => {
    if (user) {
      fetchMeals();
    }
  }, [user, dateRange]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setIsLoading(true);

      if (!dateRange.from) {
        setMeals([]);
        return;
      }

      // Handle single day selection (when from and to are the same or to is null)
      const startOfDay = new Date(dateRange.from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = dateRange.to
        ? new Date(dateRange.to)
        : new Date(dateRange.from);
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

  const handleAddMeal = async (
    newMeal: Omit<NutritionMeal, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    try {
      if (!user) throw new Error("User not authenticated");

      setIsLoading(true);
      const mealData = {
        ...newMeal,
        user_id: user.id,
        fiber: newMeal.fiber || 0,
        sugar: newMeal.sugar || 0,
      };

      const { data, error } = await supabase
        .from("nutrition_meals")
        .insert(mealData)
        .select()
        .single();

      if (error) throw error;

      setMeals([...meals, data]);
      toast.success("Meal added successfully");
    } catch (error) {
      console.error("Error adding meal:", error);
      toast.error("Failed to add meal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMeal = async (
    mealId: string,
    updatedMeal: Partial<NutritionMeal>
  ) => {
    try {
      if (!user) throw new Error("User not authenticated");

      setIsLoading(true);
      const mealData = {
        ...updatedMeal,
        fiber: updatedMeal.fiber || 0,
        sugar: updatedMeal.sugar || 0,
      };

      const { data, error } = await supabase
        .from("nutrition_meals")
        .update(mealData)
        .eq("id", mealId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setMeals(
        meals.map((meal) => (meal.id === mealId ? { ...meal, ...data } : meal))
      );

      toast.success("Meal updated successfully");
    } catch (error) {
      console.error("Error updating meal:", error);
      toast.error("Failed to update meal");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("nutrition_meals")
        .delete()
        .eq("id", mealId)
        .eq("user_id", user?.id);

      if (error) throw error;

      setMeals(meals.filter((meal) => meal.id !== mealId));
      toast.success("Meal deleted successfully");
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast.error("Failed to delete meal");
      throw error;
    } finally {
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

  // Calculate nutrition totals for the selected date range
  const rangeNutrition = {
    calories: meals.reduce((sum, meal) => sum + meal.calories, 0),
    protein: meals.reduce((sum, meal) => sum + meal.protein, 0),
    carbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
    fat: meals.reduce((sum, meal) => sum + meal.fat, 0),
    fiber: meals.reduce((sum, meal) => sum + (meal.fiber || 0), 0),
    sugar: meals.reduce((sum, meal) => sum + (meal.sugar || 0), 0),
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nutrition</h1>
          <p className="text-muted-foreground mt-1">
            Track your nutrition intake and meal planning across date ranges
          </p>
        </div>

        {/* Add Meal Button - Centered on mobile, right-aligned on desktop */}
        <div className="w-full md:w-auto flex justify-start md:justify-end">
          <Button
            onClick={() => setShowAddMeal(true)}
            className="wellness-gradient"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Meal
          </Button>
        </div>
      </div>

      {/* Enhanced Date Range Picker with Preset Buttons */}
      <div className="space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <EnhancedDateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-full max-w-sm md:w-auto"
          />

          {/* Quick Preset Buttons - Below on mobile, next to calendar on desktop */}
          <div className="flex flex-wrap justify-center lg:justify-start lg:mx-10 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-8"
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                setDateRange({ from: today, to: today });
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-8"
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                setDateRange({ from: yesterday, to: today });
              }}
            >
              Last 2 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-8"
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                setDateRange({ from: weekAgo, to: today });
              }}
            >
              Last 7 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-8"
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const monthAgo = new Date(today);
                monthAgo.setDate(today.getDate() - 30);
                setDateRange({ from: monthAgo, to: today });
              }}
            >
              Last 30 Days
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All Meals</TabsTrigger>
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch">Lunch</TabsTrigger>
              <TabsTrigger value="dinner">Dinner</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <MealList
                meals={meals}
                loading={loading}
                onDelete={handleDeleteMeal}
                onUpdate={handleUpdateMeal}
                filter="all"
              />
            </TabsContent>

            <TabsContent value="breakfast">
              <MealList
                meals={meals}
                loading={loading}
                onDelete={handleDeleteMeal}
                onUpdate={handleUpdateMeal}
                filter="breakfast"
              />
            </TabsContent>

            <TabsContent value="lunch">
              <MealList
                meals={meals}
                loading={loading}
                onDelete={handleDeleteMeal}
                onUpdate={handleUpdateMeal}
                filter="lunch"
              />
            </TabsContent>

            <TabsContent value="dinner">
              <MealList
                meals={meals}
                loading={loading}
                onDelete={handleDeleteMeal}
                onUpdate={handleUpdateMeal}
                filter="dinner"
              />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <NutritionSummary
            nutrition={rangeNutrition}
            targets={nutritionTargets}
            dateRange={dateRange}
          />
        </div>
      </div>

      <AddMealDialog
        open={showAddMeal}
        onOpenChange={setShowAddMeal}
        onSubmit={handleAddMeal}
        selectedDate={dateRange.from || new Date()}
      />
    </div>
  );
}
