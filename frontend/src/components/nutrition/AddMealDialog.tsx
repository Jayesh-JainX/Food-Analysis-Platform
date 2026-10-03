import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NutritionMeal } from "@/integrations/supabase/database-types";
import { FoodSearch } from "./FoodSearch";
import { FoodItem } from "@/data/foodDatabase";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface AddMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    meal: Omit<NutritionMeal, "id" | "user_id" | "created_at" | "updated_at">
  ) => void;
  selectedDate: Date;
}

export function AddMealDialog({
  open,
  onOpenChange,
  onSubmit,
  selectedDate,
}: AddMealDialogProps) {
  const { user } = useAuth();
  const [userDietaryRestrictions, setUserDietaryRestrictions] = useState<
    string[]
  >([]);
  const [name, setName] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [fiber, setFiber] = useState(0);
  const [sugar, setSugar] = useState(0);
  const [servingSize, setServingSize] = useState("");
  const [time, setTime] = useState("");
  const [foodSelected, setFoodSelected] = useState(false);

  // Get current time in HH:MM:SS format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 8); // HH:MM:SS format
  };

  // Set default time based on meal type or current time
  useEffect(() => {
    if (!foodSelected) {
      switch (mealType) {
        case "breakfast":
          setTime("08:00:00");
          break;
        case "lunch":
          setTime("13:00:00");
          break;
        case "dinner":
          setTime("19:00:00");
          break;
        case "snack":
          setTime("16:00:00");
          break;
        default:
          setTime(getCurrentTime());
      }
    }
  }, [mealType, foodSelected]);

  // Set current time when dialog opens
  useEffect(() => {
    if (open && !foodSelected) {
      setTime(getCurrentTime());
    }
  }, [open, foodSelected]);

  // Fetch user's dietary restrictions
  useEffect(() => {
    const fetchUserDietaryRestrictions = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("dietary_restrictions")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (profile && profile.dietary_restrictions) {
          setUserDietaryRestrictions(profile.dietary_restrictions);
        }
      } catch (error) {
        console.error("Error fetching dietary restrictions:", error);
      }
    };

    fetchUserDietaryRestrictions();
  }, [user]);

  // Function to search user's previous meals
  const searchUserMeals = async (searchTerm: string): Promise<FoodItem[]> => {
    if (!user || !searchTerm || searchTerm.length < 2) return [];

    try {
      const { data: meals, error } = await supabase
        .from("nutrition_meals")
        .select("*")
        .eq("user_id", user.id)
        .ilike("name", `%${searchTerm}%`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error searching user meals:", error);
        return [];
      }

      // Convert nutrition meals to FoodItem format
      const uniqueMeals = new Map<string, FoodItem>();

      meals?.forEach((meal) => {
        const key = meal.name.toLowerCase();
        if (!uniqueMeals.has(key)) {
          uniqueMeals.set(key, {
            name: meal.name,
            type: "user-meal", // Special type to identify user's previous meals
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0,
            fiber: meal.fiber || 0,
            sugar: meal.sugar || 0,
            servingSize: meal.serving_size || "1 serving",
            defaultServingSize: meal.serving_size || "1 serving",
          });
        }
      });

      return Array.from(uniqueMeals.values());
    } catch (error) {
      console.error("Error searching user meals:", error);
      return [];
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    console.log("Food selected in AddMealDialog:", food); // Debug log

    // Fill all form fields with selected food data
    setName(food.name);
    setCalories(Number(food.calories) || 0);
    setProtein(Number(food.protein) || 0);
    setCarbs(Number(food.carbs) || 0);
    setFat(Number(food.fat) || 0);
    setFiber(Number(food.fiber) || 0);
    setSugar(Number(food.sugar) || 0);
    setServingSize(food.servingSize || "");

    // Set meal type based on food type or keep current selection
    if (food.type === "user-meal") {
      // For user meals, keep the current meal type selection
      setFoodSelected(true);
    } else {
      // For database foods, suggest a meal type based on the current time
      const currentHour = new Date().getHours();
      if (currentHour < 11) {
        setMealType("breakfast");
      } else if (currentHour < 16) {
        setMealType("lunch");
      } else if (currentHour < 21) {
        setMealType("dinner");
      } else {
        setMealType("snack");
      }
      setFoodSelected(true);
    }

    console.log("Form updated with:", {
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber,
      sugar: food.sugar,
      servingSize: food.servingSize,
    }); // Debug log
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!name.trim()) {
      alert("Please enter a meal name");
      return;
    }

    // Create consumed_at datetime by combining the selected date with the time
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const consumedAt = new Date(selectedDate);
    consumedAt.setHours(hours, minutes, seconds || 0, 0);

    onSubmit({
      name: name.trim(),
      meal_type: mealType,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      serving_size: servingSize.trim() || null,
      image_url: null,
      consumed_at: consumedAt.toISOString(),
    });

    // Reset form
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName("");
    setMealType("breakfast");
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFat(0);
    setFiber(0);
    setSugar(0);
    setServingSize("");
    setTime(getCurrentTime());
    setFoodSelected(false);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] md:max-h-[80vh] max-w-[95vw] md:max-w-[600px] overflow-y-auto rounded-lg md:rounded-lg">
        <DialogHeader>
          <DialogTitle>Add New Meal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Search Food Database</Label>
            <FoodSearch
              onSelect={handleFoodSelect}
              autoFocus={true}
              searchUserMeals={searchUserMeals}
              dietaryRestrictions={userDietaryRestrictions}
            />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meal-name">Meal Name</Label>
              <Input
                id="meal-name"
                placeholder="e.g. Paneer Butter Masala"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger id="meal-type">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serving-size">Serving Size</Label>
              <Input
                id="serving-size"
                placeholder="e.g. 1 cup, 100g"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker" className="px-1">
                Time
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                value={protein}
                onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                value={carbs}
                onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                value={fat}
                onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                type="number"
                min="0"
                step="0.1"
                value={fiber}
                onChange={(e) => setFiber(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sugar">Sugar (g)</Label>
              <Input
                id="sugar"
                type="number"
                min="0"
                step="0.1"
                value={sugar}
                onChange={(e) => setSugar(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end sm:space-x-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Add Meal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
