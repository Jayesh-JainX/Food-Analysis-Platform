import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Utensils } from "lucide-react";

interface NutritionPreferences {
  daily_calories_target: number;
  daily_protein_target: number;
  daily_carbs_target: number;
  daily_fat_target: number;
  daily_fiber_target: number;
  daily_sugar_limit: number;
  dietary_restrictions: string[];
  meal_types: string[];
}

export function NutritionPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NutritionPreferences>({
    daily_calories_target: 2000,
    daily_protein_target: 150,
    daily_carbs_target: 250,
    daily_fat_target: 70,
    daily_fiber_target: 30,
    daily_sugar_limit: 50,
    dietary_restrictions: [],
    meal_types: ["breakfast", "lunch", "dinner", "snack"],
  });
  const [isSaving, setIsSaving] = useState(false);

  // Calculate calories from protein, carbs, and fat
  const calculateCalories = (
    protein: number,
    carbs: number,
    fat: number
  ): number => {
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram
    return protein * 4 + carbs * 4 + fat * 9;
  };

  // Update calories whenever protein, carbs, or fat changes
  const updateCalories = (protein: number, carbs: number, fat: number) => {
    const calculatedCalories = calculateCalories(protein, carbs, fat);
    setPreferences((prev) => ({
      ...prev,
      daily_calories_target: calculatedCalories,
    }));
  };

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (profile) {
        const protein = profile.daily_protein_target || 150;
        const carbs = profile.daily_carbs_target || 250;
        const fat = profile.daily_fat_target || 70;
        const calculatedCalories = calculateCalories(protein, carbs, fat);

        setPreferences({
          daily_calories_target: calculatedCalories,
          daily_protein_target: protein,
          daily_carbs_target: carbs,
          daily_fat_target: fat,
          daily_fiber_target: profile.daily_fiber_target || 30,
          daily_sugar_limit: profile.daily_sugar_limit || 50,
          dietary_restrictions: profile.dietary_restrictions || [],
          meal_types: profile.meal_types || [
            "breakfast",
            "lunch",
            "dinner",
            "snack",
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching nutrition preferences:", error);
      toast.error("Failed to load nutrition preferences");
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Calculate the final calories before saving
      const finalCalories = calculateCalories(
        preferences.daily_protein_target,
        preferences.daily_carbs_target,
        preferences.daily_fat_target
      );

      const { error } = await supabase
        .from("profiles")
        .update({
          daily_calories_target: finalCalories,
          daily_protein_target: preferences.daily_protein_target,
          daily_carbs_target: preferences.daily_carbs_target,
          daily_fat_target: preferences.daily_fat_target,
          daily_fiber_target: preferences.daily_fiber_target,
          daily_sugar_limit: preferences.daily_sugar_limit,
          dietary_restrictions: preferences.dietary_restrictions,
          meal_types: preferences.meal_types,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Nutrition preferences updated successfully");
    } catch (error) {
      console.error("Error saving nutrition preferences:", error);
      toast.error("Failed to save nutrition preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const dietaryOptions = [
    { value: "none", label: "None" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten-free", label: "Gluten-free" },
    { value: "dairy-free", label: "Dairy-free" },
    { value: "keto", label: "Keto" },
    { value: "paleo", label: "Paleo" },
    { value: "mediterranean", label: "Mediterranean" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          Nutrition Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="calories">Daily Calorie Target (Calculated)</Label>
            <Input
              id="calories"
              type="number"
              value={preferences.daily_calories_target}
              disabled
              className="bg-muted text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="protein">Daily Protein Target (g)</Label>
            <Input
              id="protein"
              type="number"
              min="0"
              max="500"
              value={preferences.daily_protein_target}
              onChange={(e) => {
                const newProtein = parseInt(e.target.value) || 0;
                setPreferences((prev) => ({
                  ...prev,
                  daily_protein_target: newProtein,
                }));
                updateCalories(
                  newProtein,
                  preferences.daily_carbs_target,
                  preferences.daily_fat_target
                );
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carbs">Daily Carbs Target (g)</Label>
            <Input
              id="carbs"
              type="number"
              min="0"
              max="1000"
              value={preferences.daily_carbs_target}
              onChange={(e) => {
                const newCarbs = parseInt(e.target.value) || 0;
                setPreferences((prev) => ({
                  ...prev,
                  daily_carbs_target: newCarbs,
                }));
                updateCalories(
                  preferences.daily_protein_target,
                  newCarbs,
                  preferences.daily_fat_target
                );
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fat">Daily Fat Target (g)</Label>
            <Input
              id="fat"
              type="number"
              min="0"
              max="300"
              value={preferences.daily_fat_target}
              onChange={(e) => {
                const newFat = parseInt(e.target.value) || 0;
                setPreferences((prev) => ({
                  ...prev,
                  daily_fat_target: newFat,
                }));
                updateCalories(
                  preferences.daily_protein_target,
                  preferences.daily_carbs_target,
                  newFat
                );
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fiber">Daily Fiber Target (g)</Label>
            <Input
              id="fiber"
              type="number"
              min="0"
              max="100"
              value={preferences.daily_fiber_target}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  daily_fiber_target: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sugar">Daily Sugar Limit (g)</Label>
            <Input
              id="sugar"
              type="number"
              min="0"
              max="200"
              className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:_textfield]"
              value={preferences.daily_sugar_limit}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  daily_sugar_limit: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Dietary Restrictions</Label>
          <Select
            value={preferences.dietary_restrictions[0] || "none"}
            onValueChange={(value) =>
              setPreferences({
                ...preferences,
                dietary_restrictions: value === "none" ? [] : [value],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select dietary restriction" />
            </SelectTrigger>
            <SelectContent>
              {dietaryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          className="wellness-gradient w-full"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
