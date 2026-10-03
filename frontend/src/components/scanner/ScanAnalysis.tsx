import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FoodScan {
  id: string;
  user_id: string;
  name: string;
  type?: string;
  scan_date: string;
  health_score?: number;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
  };
  product_recognized?: boolean;
  is_inappropriate?: boolean;
  product_brand?: string;
}

interface ScanAnalytics {
  totalScans: number;
  averageHealthScore: number;
  recognizedProducts: number;
  appropriateScans: number;
  foodTypeDistribution: { name: string; value: number; color: string }[];
  recentTrends: { date: string; healthScore: number; name: string }[];
  nutritionAverages: {
    name: string;
    value: number;
    unit: string;
    color: string;
  }[];
  brandDistribution: { name: string; value: number }[];
  monthlyTrends: { month: string; scans: number; avgHealth: number }[];
}

// Helper function to safely extract nutrition data
const safeNutrition = (nutrition: any, key: string): number => {
  if (!nutrition) return 0;
  if (typeof nutrition === "object" && nutrition[key] !== undefined) {
    return Number(nutrition[key]) || 0;
  }
  return 0;
};

// Helper function to get color for food types
const getFoodTypeColor = (type: string, index: number = 0): string => {
  const colors: { [key: string]: string } = {
    // Primary food categories
    fruit: "#22c55e",
    vegetable: "#16a34a",
    meat: "#dc2626",
    dairy: "#f59e0b",
    grain: "#d97706",
    snack: "#ef4444",
    beverage: "#3b82f6",
    seafood: "#06b6d4",
    nuts: "#8b5cf6",
    dessert: "#ec4899",

    // Additional categories
    breakfast: "#f97316",
    lunch: "#10b981",
    dinner: "#6366f1",
    protein: "#dc2626",
    carbs: "#f59e0b",
    fat: "#ef4444",
    fiber: "#22c55e",
    sugar: "#ec4899",

    // Common variations
    fruits: "#22c55e",
    vegetables: "#16a34a",
    grains: "#d97706",
    beverages: "#3b82f6",
    desserts: "#ec4899",
    snacks: "#ef4444",
    proteins: "#dc2626",
    dairy_products: "#f59e0b",

    // Fallback colors for unknown types
    other: "#6b7280",
    unknown: "#9ca3af",
    misc: "#6b7280",
  };

  // Fallback color array for variety
  const fallbackColors = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#ec4899", // Pink
    "#84cc16", // Lime
    "#06b6d4", // Teal
    "#f43f5e", // Rose
    "#a855f7", // Violet
    "#14b8a6", // Emerald
    "#fbbf24", // Amber
    "#fb7185", // Rose
  ];

  const normalizedType = type?.toLowerCase().trim();
  const specificColor = colors[normalizedType];

  if (specificColor) {
    return specificColor;
  }

  // Use fallback color based on index to ensure variety
  return fallbackColors[index % fallbackColors.length];
};

export function ScanAnalysis() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ScanAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  useEffect(() => {
    if (user) {
      fetchScanAnalytics();
    }
  }, [user, timeRange]);

  const fetchScanAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      let startDate: Date;

      switch (timeRange) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }

      const { data, error } = await supabase
        .from("food_scans")
        .select("*")
        .eq("user_id", user?.id)
        .gte("scan_date", startDate.toISOString())
        .order("scan_date", { ascending: false });

      if (error) throw error;

      const scans = data || [];
      const analytics = processScans(scans as FoodScan[]);
      setAnalytics(analytics);
    } catch (error) {
      console.error("Error fetching scan analytics:", error);
      toast.error("Failed to load scan analytics");
    } finally {
      setLoading(false);
    }
  };

  const processScans = (scans: FoodScan[]): ScanAnalytics => {
    if (scans.length === 0) {
      return {
        totalScans: 0,
        averageHealthScore: 0,
        recognizedProducts: 0,
        appropriateScans: 0,
        foodTypeDistribution: [],
        recentTrends: [],
        nutritionAverages: [],
        brandDistribution: [],
        monthlyTrends: [],
      };
    }

    // Basic statistics
    const totalScans = scans.length;
    const recognizedProducts = scans.filter(
      (scan) => scan.product_recognized
    ).length;
    const appropriateScans = scans.filter(
      (scan) => !scan.is_inappropriate
    ).length;

    // Calculate average health score (only for scans with health scores)
    const scansWithHealthScore = scans.filter(
      (scan) => scan.health_score !== null && scan.health_score !== undefined
    );
    const averageHealthScore =
      scansWithHealthScore.length > 0
        ? scansWithHealthScore.reduce(
            (acc, scan) => acc + (scan.health_score || 0),
            0
          ) / scansWithHealthScore.length
        : 0;

    // Food type distribution
    const typeCount: { [key: string]: number } = {};
    scans.forEach((scan) => {
      const type = scan.type || "other";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const foodTypeDistribution = Object.entries(typeCount)
      .map(([name, value], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: getFoodTypeColor(name, index),
      }))
      .sort((a, b) => b.value - a.value);

    // Recent trends (last 10 scans)
    const recentTrends = scans
      .slice(0, 10)
      .filter(
        (scan) => scan.health_score !== null && scan.health_score !== undefined
      )
      .map((scan, index) => ({
        date: format(new Date(scan.scan_date), "MM/dd"),
        healthScore: scan.health_score || 0,
        name: scan.name,
      }))
      .reverse();

    // Nutrition averages (only for scans with nutrition data)
    const scansWithNutrition = scans.filter((scan) => scan.nutrition);
    const nutritionAverages =
      scansWithNutrition.length > 0
        ? [
            {
              name: "Calories",
              value:
                scansWithNutrition.reduce(
                  (acc, scan) =>
                    acc + safeNutrition(scan.nutrition, "calories"),
                  0
                ) / scansWithNutrition.length,
              unit: "kcal",
              color: "#f59e0b",
            },
            {
              name: "Protein",
              value:
                scansWithNutrition.reduce(
                  (acc, scan) => acc + safeNutrition(scan.nutrition, "protein"),
                  0
                ) / scansWithNutrition.length,
              unit: "g",
              color: "#3b82f6",
            },
            {
              name: "Carbs",
              value:
                scansWithNutrition.reduce(
                  (acc, scan) => acc + safeNutrition(scan.nutrition, "carbs"),
                  0
                ) / scansWithNutrition.length,
              unit: "g",
              color: "#f97316",
            },
            {
              name: "Fat",
              value:
                scansWithNutrition.reduce(
                  (acc, scan) => acc + safeNutrition(scan.nutrition, "fat"),
                  0
                ) / scansWithNutrition.length,
              unit: "g",
              color: "#ef4444",
            },
            {
              name: "Fiber",
              value:
                scansWithNutrition.reduce(
                  (acc, scan) => acc + safeNutrition(scan.nutrition, "fiber"),
                  0
                ) / scansWithNutrition.length,
              unit: "g",
              color: "#22c55e",
            },
            {
              name: "Sugar",
              value:
                scansWithNutrition.reduce(
                  (acc, scan) => acc + safeNutrition(scan.nutrition, "sugar"),
                  0
                ) / scansWithNutrition.length,
              unit: "g",
              color: "#ec4899",
            },
          ]
        : [];

    // Brand distribution (top 5 brands)
    const brandCount: { [key: string]: number } = {};
    scans.forEach((scan) => {
      if (scan.product_brand) {
        brandCount[scan.product_brand] =
          (brandCount[scan.product_brand] || 0) + 1;
      }
    });

    const brandDistribution = Object.entries(brandCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Monthly trends (group by month)
    const monthlyData: {
      [key: string]: { scans: number; totalHealth: number; count: number };
    } = {};
    scans.forEach((scan) => {
      const month = format(new Date(scan.scan_date), "MMM yyyy");
      if (!monthlyData[month]) {
        monthlyData[month] = { scans: 0, totalHealth: 0, count: 0 };
      }
      monthlyData[month].scans += 1;
      if (scan.health_score !== null && scan.health_score !== undefined) {
        monthlyData[month].totalHealth += scan.health_score;
        monthlyData[month].count += 1;
      }
    });

    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        scans: data.scans,
        avgHealth:
          data.count > 0 ? Math.round(data.totalHealth / data.count) : 0,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months

    return {
      totalScans,
      averageHealthScore: Math.round(averageHealthScore * 10) / 10,
      recognizedProducts,
      appropriateScans,
      foodTypeDistribution,
      recentTrends,
      nutritionAverages,
      brandDistribution,
      monthlyTrends,
    };
  };

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No scan data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(["week", "month", "all"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              timeRange === range
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {range === "week"
              ? "Last Week"
              : range === "month"
              ? "Last Month"
              : "All Time"}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{analytics.totalScans}</div>
            <p className="text-sm text-muted-foreground">Total Scans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {analytics.averageHealthScore}
            </div>
            <p className="text-sm text-muted-foreground">Avg Health Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {analytics.recognizedProducts}
            </div>
            <p className="text-sm text-muted-foreground">Recognized Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {analytics.totalScans > 0
                ? Math.round(
                    (analytics.appropriateScans / analytics.totalScans) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Health Score Trends</CardTitle>
            <CardDescription>Recent scan health scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.recentTrends}
                  margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} width={40} />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}`,
                      "Health Score",
                      props.payload?.name ? `Food: ${props.payload.name}` : "",
                    ]}
                  />
                  <Line
                    dataKey="healthScore"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Food Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Food Type Distribution</CardTitle>
            <CardDescription>Types of food scanned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.foodTypeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => {
                      const label =
                        name.length > 8 ? name.substring(0, 8) + "..." : name;
                      return `${label} ${(percent * 100).toFixed(0)}%`;
                    }}
                    labelLine={false}
                  >
                    {analytics.foodTypeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.color || getFoodTypeColor(entry.name, index)
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} scans`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        {analytics.monthlyTrends.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>
                Scans and health scores by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.monthlyTrends}
                    margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} width={40} />
                    <Tooltip />
                    <Bar dataKey="scans" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nutrition Averages */}
        <Card>
          <CardHeader>
            <CardTitle>Average Nutrition Profile</CardTitle>
            <CardDescription>Per scan averages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.nutritionAverages.map((nutrient) => (
                <div key={nutrient.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{nutrient.name}</span>
                    <Badge variant="outline">
                      {nutrient.value.toFixed(1)} {nutrient.unit}
                    </Badge>
                  </div>
                  <Progress
                    value={Math.min(
                      (nutrient.value /
                        (nutrient.name === "Calories" ? 500 : 50)) *
                        100,
                      100
                    )}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Distribution */}
      {analytics.brandDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Brands Scanned</CardTitle>
            <CardDescription>Most frequently scanned brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.brandDistribution.map((brand, index) => (
                <div
                  key={brand.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <span>{brand.name}</span>
                  </div>
                  <Badge variant="secondary">{brand.value} scans</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
