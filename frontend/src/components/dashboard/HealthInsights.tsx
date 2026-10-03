import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Clock,
  Utensils,
  Target,
  TrendingUp,
  Heart,
  Zap,
  Lightbulb,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type MacroTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
};

interface HealthInsight {
  wellnessScore: number;
  mealTimings: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  nutritionSummary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    totalSugar: number;
    avgHealthScore: number;
  };
  dailyTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  healthMetrics: {
    avgSteps: number;
    avgSleep: number;
    avgWater: number;
    avgActiveMinutes: number;
  };
  recommendations: string[];
  scanActivity: {
    totalScans: number;
    appropriateScans: number;
    recognizedProducts: number;
  };
  todayTotals: MacroTotals;
}

interface FoodScan {
  health_score?: number;
  is_inappropriate?: boolean;
  product_recognized?: boolean;
}

interface NutritionMeal {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  meal_type?: string;
  consumed_at?: string | Date;
}

interface HealthMetric {
  steps?: number;
  sleep?: number;
  water?: number;
  active_minutes?: number;
}

interface Profile {
  daily_calories_target?: number;
  daily_protein_target?: number;
  daily_carbs_target?: number;
  daily_fat_target?: number;
  daily_fiber_target?: number;
  daily_sugar_limit?: number;
}

interface HealthInsightsProps {
  showRecommendationsOnly?: boolean;
}

export function HealthInsights({
  showRecommendationsOnly = false,
}: HealthInsightsProps) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<HealthInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHealthInsights();
    }
  }, [user]);

  const fetchHealthInsights = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      // Fetch user profile for daily targets
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      // Fetch food scans from last 7 days
      const { data: foodScans } = await supabase
        .from("food_scans")
        .select("*")
        .eq("user_id", user?.id)
        .gte("scan_date", sevenDaysAgo.toISOString());

      // Fetch nutrition meals from last 7 days
      const { data: nutritionMeals } = await supabase
        .from("nutrition_meals")
        .select("*")
        .eq("user_id", user?.id)
        .gte("consumed_at", sevenDaysAgo.toISOString());

      // Fetch health metrics from last 7 days
      const { data: healthMetrics } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", user?.id)
        .gte("date", sevenDaysAgo.toISOString().split("T")[0]);

      const insights = analyzeHealthData(
        (foodScans || []) as FoodScan[],
        (nutritionMeals || []) as NutritionMeal[],
        (healthMetrics || []) as HealthMetric[],
        profile as Profile
      );
      setInsights(insights);
    } catch (error) {
      console.error("Error fetching health insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeHealthData = (
    scans: FoodScan[],
    meals: NutritionMeal[],
    metrics: HealthMetric[],
    profile: Profile | null
  ): HealthInsight => {
    // Calculate nutrition summary
    const nutritionSummary = meals.reduce(
      (acc, meal) => ({
        totalCalories: acc.totalCalories + (meal.calories || 0),
        totalProtein: acc.totalProtein + (meal.protein || 0),
        totalCarbs: acc.totalCarbs + (meal.carbs || 0),
        totalFat: acc.totalFat + (meal.fat || 0),
        totalFiber: acc.totalFiber + (meal.fiber || 0),
        totalSugar: acc.totalSugar + (meal.sugar || 0),
        avgHealthScore: acc.avgHealthScore,
      }),
      {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        totalSugar: 0,
        avgHealthScore: 0,
      }
    );

    // Compute today's totals from meals
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const mealsToday = meals.filter((meal) => {
      const consumedAt = meal.consumed_at ? new Date(meal.consumed_at) : null;
      return consumedAt
        ? consumedAt >= startOfToday && consumedAt <= endOfToday
        : false;
    });
    const todayTotals = mealsToday.reduce<MacroTotals>(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
        fiber: acc.fiber + (meal.fiber || 0),
        sugar: acc.sugar + (meal.sugar || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
    );

    // Calculate average health score from scans
    const validHealthScores = scans
      .filter((scan) => typeof scan.health_score === "number")
      .map((scan) => scan.health_score as number);
    nutritionSummary.avgHealthScore =
      validHealthScores.length > 0
        ? validHealthScores.reduce((acc, score) => acc + score, 0) /
          validHealthScores.length
        : 0;

    // Analyze meal timings by meal type
    const mealTimings = meals.reduce(
      (acc: any, meal) => {
        const mealType = meal.meal_type || "snack";
        acc[mealType] = (acc[mealType] || 0) + 1;
        return acc;
      },
      { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }
    );

    // Calculate health metrics averages
    const healthMetricsAvg = metrics.reduce(
      (acc, metric) => ({
        avgSteps: acc.avgSteps + (metric.steps || 0),
        avgSleep: acc.avgSleep + (metric.sleep || 0),
        avgWater: acc.avgWater + (metric.water || 0),
        avgActiveMinutes: acc.avgActiveMinutes + (metric.active_minutes || 0),
      }),
      { avgSteps: 0, avgSleep: 0, avgWater: 0, avgActiveMinutes: 0 }
    );

    if (metrics.length > 0) {
      healthMetricsAvg.avgSteps = Math.round(
        healthMetricsAvg.avgSteps / metrics.length
      );
      healthMetricsAvg.avgSleep =
        Math.round((healthMetricsAvg.avgSleep / metrics.length) * 10) / 10;
      healthMetricsAvg.avgWater = Math.round(
        healthMetricsAvg.avgWater / metrics.length
      );
      healthMetricsAvg.avgActiveMinutes = Math.round(
        healthMetricsAvg.avgActiveMinutes / metrics.length
      );
    }

    // Analyze scan activity
    const scanActivity = {
      totalScans: scans.length,
      appropriateScans: scans.filter((scan) => !scan.is_inappropriate).length,
      recognizedProducts: scans.filter((scan) => scan.product_recognized)
        .length,
    };

    // Daily targets from profile
    const dailyTargets = {
      calories: profile?.daily_calories_target || 2000,
      protein: profile?.daily_protein_target || 150,
      carbs: profile?.daily_carbs_target || 250,
      fat: profile?.daily_fat_target || 70,
      fiber: profile?.daily_fiber_target || 30,
      sugar: profile?.daily_sugar_limit || 50,
    };

    // Calculate wellness score based on nutrition balance (0-100)
    let wellnessScore = 0;
    const factors = [];

    // Health score from food scans (30% weight)
    if (nutritionSummary.avgHealthScore > 0) {
      factors.push(nutritionSummary.avgHealthScore * 0.3);
    }

    // Calorie balance (25% weight)
    const dailyCalories = nutritionSummary.totalCalories / 7;
    const calorieScore = Math.min(
      100,
      Math.max(
        0,
        100 -
          (Math.abs(dailyCalories - dailyTargets.calories) /
            dailyTargets.calories) *
            100
      )
    );
    factors.push(calorieScore * 0.25);

    // Protein adequacy (20% weight)
    const dailyProtein = nutritionSummary.totalProtein / 7;
    const proteinScore = Math.min(
      100,
      (dailyProtein / dailyTargets.protein) * 100
    );
    factors.push(proteinScore * 0.2);

    // Fiber intake (15% weight)
    const dailyFiber = nutritionSummary.totalFiber / 7;
    const fiberScore = Math.min(100, (dailyFiber / dailyTargets.fiber) * 100);
    factors.push(fiberScore * 0.15);
    const totalMeals = (Object.values(mealTimings) as number[]).reduce(
      (sum, count) => sum + count,
      0
    );
    const consistencyScore = totalMeals >= 14 ? 100 : (totalMeals / 14) * 100;
    factors.push(consistencyScore * 0.1);

    wellnessScore = Math.round(
      factors.reduce((sum, factor) => sum + factor, 0)
    );

    // Generate recommendations
    const recommendations = [];

    if (nutritionSummary.avgHealthScore < 70) {
      recommendations.push(
        "Focus on whole foods and reduce processed items for better health scores"
      );
    }

    if (mealTimings.breakfast === 0) {
      recommendations.push(
        "Don't skip breakfast - it kickstarts your metabolism"
      );
    }

    if (nutritionSummary.totalCalories / 7 < dailyTargets.calories * 0.8) {
      recommendations.push(
        "You may be under-eating. Consider increasing your daily calorie intake"
      );
    }

    if (nutritionSummary.totalFiber / 7 < dailyTargets.fiber * 0.7) {
      recommendations.push(
        "Increase fiber intake with more fruits, vegetables, and whole grains"
      );
    }

    if (healthMetricsAvg.avgSteps > 0 && healthMetricsAvg.avgSteps < 8000) {
      recommendations.push(
        "Try to increase daily steps - aim for at least 8,000-10,000 steps"
      );
    }

    if (healthMetricsAvg.avgSleep > 0 && healthMetricsAvg.avgSleep < 7) {
      recommendations.push(
        "Prioritize sleep - aim for 7-9 hours per night for optimal health"
      );
    }

    if (scanActivity.totalScans < 5) {
      recommendations.push(
        "Scan more foods to get better insights into your eating patterns"
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Great job! Keep maintaining your healthy lifestyle"
      );
    }

    return {
      wellnessScore,
      mealTimings,
      nutritionSummary,
      dailyTargets,
      healthMetrics: healthMetricsAvg,
      recommendations,
      scanActivity,
      todayTotals: todayTotals as MacroTotals,
    };
  };

  // If showing recommendations only, return just the recommendations card
  if (showRecommendationsOnly) {
    if (loading) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                >
                  <Skeleton className="h-2 w-2 rounded-full mt-2" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!insights) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <span className="block w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Wellness Score Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Other sections skeleton */}
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      {/* Wellness Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Overall Wellness Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Activity className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <div className="text-sm font-medium text-muted-foreground">
                Based on nutrition balance and food quality
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-bold">
                  {insights.wellnessScore}
                </span>
                <Badge
                  variant="outline"
                  className={
                    insights.wellnessScore >= 80
                      ? "text-green-500 border-green-500"
                      : insights.wellnessScore >= 60
                      ? "text-amber-500 border-amber-500"
                      : "text-red-500 border-red-500"
                  }
                >
                  {insights.wellnessScore >= 80
                    ? "Excellent"
                    : insights.wellnessScore >= 60
                    ? "Good"
                    : "Needs Improvement"}
                </Badge>
              </div>
              <Progress value={insights.wellnessScore} className="mt-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {insights.todayTotals.calories}
              </div>
              <div className="text-sm text-muted-foreground">
                / {insights.dailyTargets.calories} daily
              </div>
              <Progress
                value={
                  (insights.todayTotals.calories /
                    insights.dailyTargets.calories) *
                  100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Protein
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {insights.todayTotals.protein}g
              </div>
              <div className="text-sm text-muted-foreground">
                / {insights.dailyTargets.protein}g daily
              </div>
              <Progress
                value={
                  (insights.todayTotals.protein /
                    insights.dailyTargets.protein) *
                  100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Carbs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {insights.todayTotals.carbs}g
              </div>
              <div className="text-sm text-muted-foreground">
                / {insights.dailyTargets.carbs}g daily
              </div>
              <Progress
                value={
                  (insights.todayTotals.carbs / insights.dailyTargets.carbs) *
                  100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Fat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {insights.todayTotals.fat}g
              </div>
              <div className="text-sm text-muted-foreground">
                / {insights.dailyTargets.fat}g daily
              </div>
              <Progress
                value={
                  (insights.todayTotals.fat / insights.dailyTargets.fat) * 100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meal Distribution Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Meal Distribution (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(insights.mealTimings).map(([mealType, count]) => (
              <div
                key={mealType}
                className="text-center p-4 bg-muted rounded-lg"
              >
                <div className="text-sm capitalize font-medium">{mealType}</div>
                <div className="text-2xl font-bold mt-1">{count}</div>
                <div className="text-xs text-muted-foreground">meals</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics Card */}
      {insights.healthMetrics.avgSteps > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Metrics Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Daily Steps</div>
                <div className="text-2xl font-bold">
                  {insights.healthMetrics.avgSteps.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Sleep (hours)
                </div>
                <div className="text-2xl font-bold">
                  {insights.healthMetrics.avgSleep}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Water (glasses)
                </div>
                <div className="text-2xl font-bold">
                  {insights.healthMetrics.avgWater}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Active Minutes
                </div>
                <div className="text-2xl font-bold">
                  {insights.healthMetrics.avgActiveMinutes}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Food Scanning Activity Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Food Scanning Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Total Scans</div>
              <div className="text-2xl font-bold">
                {insights.scanActivity.totalScans}
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">
                Recognized Products
              </div>
              <div className="text-2xl font-bold">
                {insights.scanActivity.recognizedProducts}
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">
                Avg Health Score
              </div>
              <div className="text-2xl font-bold">
                {Math.round(insights.nutritionSummary.avgHealthScore)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
