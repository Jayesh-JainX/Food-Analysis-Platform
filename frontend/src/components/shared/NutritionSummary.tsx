import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NutritionSummaryProps {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  targets?: {
    daily_calories_target: number;
    daily_protein_target: number;
    daily_carbs_target: number;
    daily_fat_target: number;
    daily_fiber_target: number;
    daily_sugar_limit: number;
  };
  dateRange?: {
    from: Date;
    to?: Date;
  };
}

interface NutrientProgressProps {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

function NutrientProgress({
  name,
  current,
  target,
  unit,
  color,
}: NutrientProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <span>
          {current.toFixed(1)} / {target} {unit}
        </span>
      </div>
      <div className="h-2 w-full bg-muted/80 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export function NutritionSummary({
  nutrition,
  targets,
  dateRange,
}: NutritionSummaryProps) {
  // Default target nutrition values if not provided
  const defaultTargets = {
    daily_calories_target: 2000,
    daily_protein_target: 150,
    daily_carbs_target: 250,
    daily_fat_target: 70,
    daily_fiber_target: 30,
    daily_sugar_limit: 50,
  };

  const nutritionTargets = targets || defaultTargets;

  const nutrients = [
    {
      name: "Protein",
      current: nutrition.protein,
      target: nutritionTargets.daily_protein_target,
      unit: "g",
      color: "bg-blue-500",
    },
    {
      name: "Carbs",
      current: nutrition.carbs,
      target: nutritionTargets.daily_carbs_target,
      unit: "g",
      color: "bg-amber-500",
    },
    {
      name: "Fat",
      current: nutrition.fat,
      target: nutritionTargets.daily_fat_target,
      unit: "g",
      color: "bg-red-500",
    },
    {
      name: "Fiber",
      current: nutrition.fiber || 0,
      target: nutritionTargets.daily_fiber_target,
      unit: "g",
      color: "bg-green-500",
    },
    {
      name: "Sugar",
      current: nutrition.sugar || 0,
      target: nutritionTargets.daily_sugar_limit,
      unit: "g",
      color: "bg-purple-500",
    },
  ];

  const caloriesPercentage = Math.round(
    (nutrition.calories / nutritionTargets.daily_calories_target) * 100
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Summary</CardTitle>
        <CardDescription>
          {dateRange ? (
            <span>
              Nutritional intake from {dateRange.from.toLocaleDateString()}
              {dateRange.to && ` to ${dateRange.to.toLocaleDateString()}`}
            </span>
          ) : (
            "Nutritional intake for selected period"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calories progress circle */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-40 w-40">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full border-8 border-muted"></div>

            {/* Progress circle with gradient */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#calorie-gradient)"
                strokeWidth="8"
                strokeDasharray="289.03"
                strokeDashoffset={289.03 * (1 - caloriesPercentage / 100)}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient
                  id="calorie-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
            </svg>

            {/* Text in the middle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{nutrition.calories}</span>
              <span className="text-sm text-muted-foreground">
                of {nutritionTargets.daily_calories_target}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                calories
              </span>
            </div>
          </div>
        </div>

        {/* Nutrient progress bars */}
        <div className="space-y-3">
          {nutrients.map((nutrient) => (
            <NutrientProgress key={nutrient.name} {...nutrient} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
