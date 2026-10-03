import { NutritionTracker } from "@/components/nutrition/NutritionTracker";
import { SEO } from "@/components/shared/SEO";

export default function NutritionPage() {
  return (
    <>
      <SEO
        title="Nutrition"
        description="Track your daily nutrition intake, monitor calories, macronutrients, and maintain a healthy diet with our comprehensive nutrition tracker."
        keywords="nutrition tracker, calorie counter, diet tracking, macronutrients, healthy eating, meal planning, food diary"
      />
      <NutritionTracker />
    </>
  );
}
