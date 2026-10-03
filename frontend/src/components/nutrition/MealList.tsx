
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NutritionMeal } from "@/integrations/supabase/database-types";
import { EditableMeal } from "./EditableMeal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/use-notifications";

interface MealListProps {
  meals: NutritionMeal[];
  loading: boolean;
  onDelete: (mealId: string) => Promise<void>;
  filter: "all" | "breakfast" | "lunch" | "dinner";
  onUpdate?: (mealId: string, updatedMeal: Partial<NutritionMeal>) => Promise<void>;
}

export function MealList({ meals, loading, onDelete, filter, onUpdate }: MealListProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [updatingMealId, setUpdatingMealId] = useState<string | null>(null);

  const filteredMeals = meals.filter(meal => {
    if (filter === "all") return true;
    return meal.meal_type === filter;
  });

  const handleUpdate = async (mealId: string, updatedMeal: Partial<NutritionMeal>) => {
    if (!user) return;
    
    try {
      setUpdatingMealId(mealId);
      
      if (onUpdate) {
        await onUpdate(mealId, updatedMeal);
      } else {
        const { error } = await supabase
          .from('nutrition_meals')
          .update(updatedMeal)
          .eq('id', mealId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      }
      
      toast.success("Meal updated successfully");
      addNotification({
        title: "Meal Updated",
        description: `Your meal "${updatedMeal.name}" has been updated.`,
        type: "success"
      });
    } catch (error) {
      console.error("Error updating meal:", error);
      toast.error("Failed to update meal");
    } finally {
      setUpdatingMealId(null);
    }
  };

  const handleDelete = async (mealId: string) => {
    try {
      await onDelete(mealId);
      
      addNotification({
        title: "Meal Deleted",
        description: "Your meal has been successfully deleted.",
        type: "info"
      });
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  if (loading) {
    return <MealList.Skeleton />;
  }

  if (filteredMeals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No {filter !== "all" ? filter : "meals"} found for this day.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredMeals.map((meal) => (
        <EditableMeal
          key={meal.id}
          meal={meal}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

// Define the skeleton loader for MealList
MealList.Skeleton = function MealListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3).fill(0).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              {Array(4).fill(0).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-6 w-12 mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
