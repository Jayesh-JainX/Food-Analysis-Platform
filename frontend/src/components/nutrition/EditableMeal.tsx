import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Check, Edit, Trash, X } from "lucide-react";
import { NutritionMeal } from "@/integrations/supabase/database-types";
import { formatTime } from "@/lib/utils";

interface EditableMealProps {
  meal: NutritionMeal;
  onUpdate: (
    mealId: string,
    updatedMeal: Partial<NutritionMeal>
  ) => Promise<void>;
  onDelete: (mealId: string) => Promise<void>;
}

export function EditableMeal({ meal, onUpdate, onDelete }: EditableMealProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMeal, setUpdatedMeal] = useState<Partial<NutritionMeal>>({
    name: meal.name,
    meal_type: meal.meal_type,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    serving_size: meal.serving_size,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      await onUpdate(meal.id, updatedMeal);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating meal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof NutritionMeal, value: any) => {
    setUpdatedMeal((prev) => ({
      ...prev,
      [field]:
        field === "calories" ||
        field === "protein" ||
        field === "carbs" ||
        field === "fat"
          ? parseInt(value) || 0
          : value,
    }));
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        {isEditing ? (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Edit Meal</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  value={updatedMeal.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select
                  value={updatedMeal.meal_type}
                  onValueChange={(value) => handleChange("meal_type", value)}
                >
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serving-size">Serving Size</Label>
                <Input
                  id="serving-size"
                  value={updatedMeal.serving_size || ""}
                  onChange={(e) => handleChange("serving_size", e.target.value)}
                  placeholder="e.g., 1 cup"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-calories">Calories</Label>
                <Input
                  id="meal-calories"
                  type="number"
                  value={updatedMeal.calories}
                  onChange={(e) => handleChange("calories", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal-protein">Protein (g)</Label>
                <Input
                  id="meal-protein"
                  type="number"
                  value={updatedMeal.protein}
                  onChange={(e) => handleChange("protein", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-carbs">Carbs (g)</Label>
                <Input
                  id="meal-carbs"
                  type="number"
                  value={updatedMeal.carbs}
                  onChange={(e) => handleChange("carbs", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-fat">Fat (g)</Label>
                <Input
                  id="meal-fat"
                  type="number"
                  value={updatedMeal.fat}
                  onChange={(e) => handleChange("fat", e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{meal.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                    {meal.meal_type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatTime(new Date(meal.consumed_at))}
                  {meal.serving_size && ` · ${meal.serving_size}`}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(meal.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-lg font-semibold">{meal.calories}</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{meal.protein}g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{meal.carbs}g</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{meal.fat}g</p>
                <p className="text-xs text-muted-foreground">Fat</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
