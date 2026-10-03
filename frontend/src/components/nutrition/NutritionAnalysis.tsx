import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Download,
  TrendingUp,
  Target,
  Activity,
  Zap,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { addDays, format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DayPicker } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface NutritionData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  meals: number;
}

interface MacroData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface DatabaseMeal {
  consumed_at: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fiber: number | null;
  sugar: number | null;
}

// Quick Select Component
function QuickSelect({
  onSelect,
  selectedValue,
}: {
  onSelect: (range: DateRange) => void;
  selectedValue: string;
}) {
  const presets = [
    {
      label: "Last 7 days",
      value: "7days",
      range: () => ({
        from: addDays(new Date(), -7),
        to: new Date(),
      }),
    },
    {
      label: "Last 30 days",
      value: "30days",
      range: () => ({
        from: addDays(new Date(), -30),
        to: new Date(),
      }),
    },
    {
      label: "Last 3 months",
      value: "3months",
      range: () => ({
        from: addDays(new Date(), -90),
        to: new Date(),
      }),
    },
    {
      label: "Last 6 months",
      value: "6months",
      range: () => ({
        from: addDays(new Date(), -180),
        to: new Date(),
      }),
    },
    {
      label: "Last year",
      value: "1year",
      range: () => ({
        from: addDays(new Date(), -365),
        to: new Date(),
      }),
    },
  ];

  const handlePresetSelect = (value: string) => {
    const preset = presets.find((p) => p.value === value);
    if (preset) {
      onSelect(preset.range());
    }
  };

  return (
    <Select value={selectedValue} onValueChange={handlePresetSelect}>
      <SelectTrigger className="flex gap-3 items-center justify-center w-full sm:w-[180px]">
        <Clock className=" h-4 w-4 flex-shrink-0" />
        <SelectValue placeholder="Quick select" />
      </SelectTrigger>
      <SelectContent>
        {presets.map((preset) => (
          <SelectItem key={preset.value} value={preset.value}>
            {preset.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Custom Date Range Picker Component
function CustomDateRangePicker({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>(value);

  // Update temp range when value changes
  useEffect(() => {
    setTempRange(value);
  }, [value]);

  const handleApply = () => {
    if (tempRange.from && tempRange.to) {
      onChange(tempRange);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTempRange(value);
    setIsOpen(false);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (range) {
      setTempRange(range);
    }
  };

  const formatDateRange = (range: DateRange) => {
    if (range.from && range.to) {
      return `${format(range.from, "MMM dd, yyyy")} - ${format(
        range.to,
        "MMM dd, yyyy"
      )}`;
    }
    if (range.from) {
      return `${format(range.from, "MMM dd, yyyy")} - Select end date`;
    }
    return "Select date range";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full sm:w-[320px] justify-start text-left font-normal",
            !value.from && "text-muted-foreground"
          )}
        >
          <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{formatDateRange(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-background border shadow-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b">
            <h4 className="font-semibold text-sm">Select Date Range</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Date Picker */}
          <DayPicker
            mode="range"
            selected={tempRange}
            onSelect={handleRangeSelect}
            numberOfMonths={1}
            className="border-0"
            showOutsideDays={false}
            classNames={{
              months: "flex flex-col space-y-4",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
              ),
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
              IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
            }}
          />

          {/* Selected Range Display */}
          {/* {tempRange.from && (
            <div className="bg-muted/50 p-3 rounded-md border">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Selected Range
              </p>
              <p className="text-sm font-medium">
                {formatDateRange(tempRange)}
              </p>
            </div>
          )} */}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={!tempRange.from || !tempRange.to}
              className="flex-1"
            >
              Apply Range
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function NutritionAnalysis() {
  const { user } = useAuth();
  const [nutritionData, setNutritionData] = useState<NutritionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState("7days");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -7), // Default to last 7 days
    to: new Date(),
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: data } = payload[0];
      const color = data.color;

      return (
        <div
          style={{
            backgroundColor: color,
            padding: "8px 12px",
            borderRadius: "6px",
            border: `1px solid white`,
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{name}</p>
          <p style={{ margin: 0 }}>{`${Number(value).toFixed(1)} kcal`}</p>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (user && dateRange.from && dateRange.to) {
      fetchNutritionData();
    }
  }, [user, dateRange]);

  const fetchNutritionData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("nutrition_meals")
        .select("*")
        .eq("user_id", user?.id)
        .gte("consumed_at", dateRange.from?.toISOString())
        .lte("consumed_at", dateRange.to?.toISOString())
        .order("consumed_at", { ascending: true });

      if (error) throw error;

      const aggregatedData: { [key: string]: NutritionData } = {};

      (data as DatabaseMeal[]).forEach((meal) => {
        const date = meal.consumed_at.split("T")[0];
        if (!aggregatedData[date]) {
          aggregatedData[date] = {
            date,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            sugar: 0,
            meals: 0,
          };
        }
        aggregatedData[date].calories += meal.calories || 0;
        aggregatedData[date].protein += meal.protein || 0;
        aggregatedData[date].carbs += meal.carbs || 0;
        aggregatedData[date].fat += meal.fat || 0;
        aggregatedData[date].fiber += meal.fiber || 0;
        aggregatedData[date].sugar += meal.sugar || 0;
        aggregatedData[date].meals += 1;
      });

      const sortedData = Object.values(aggregatedData).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setNutritionData(sortedData);
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      toast.error("Failed to load nutrition data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    // Reset preset selection when custom date is selected
    setSelectedPreset("");
  };

  const handleQuickSelect = (range: DateRange) => {
    setDateRange(range);
  };

  const handleExportPDF = async () => {
    try {
      const pdf = new jsPDF();

      // Title
      pdf.setFontSize(20);
      pdf.text("Nutrition Analysis Report", 20, 30);

      // Date range
      pdf.setFontSize(12);
      pdf.text(
        `Period: ${format(dateRange.from!, "MMM dd, yyyy")} - ${format(
          dateRange.to!,
          "MMM dd, yyyy"
        )}`,
        20,
        45
      );

      const avg = (arr: number[]) =>
        arr.length
          ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
          : "0.0";

      // Summary statistics
      pdf.text("Average Daily Intake:", 20, 65);
      pdf.text(
        `Calories: ${avg(nutritionData.map((d) => d.calories))} kcal`,
        30,
        80
      );
      pdf.text(`Protein: ${avg(nutritionData.map((d) => d.protein))}g`, 30, 95);
      pdf.text(
        `Carbohydrates: ${avg(nutritionData.map((d) => d.carbs))}g`,
        30,
        110
      );
      pdf.text(`Fat: ${avg(nutritionData.map((d) => d.fat))}g`, 30, 125);
      pdf.text(`Fiber: ${avg(nutritionData.map((d) => d.fiber))}g`, 30, 140);
      pdf.text(`Sugar: ${avg(nutritionData.map((d) => d.sugar))}g`, 30, 155);

      // Daily data table
      const tableData = nutritionData.map((day) => [
        format(new Date(day.date), "MMM dd"),
        day.calories.toFixed(1),
        day.protein.toFixed(1),
        day.carbs.toFixed(1),
        day.fat.toFixed(1),
        day.fiber.toFixed(1),
        day.sugar.toFixed(1),
        day.meals.toString(),
      ]);

      autoTable(pdf, {
        head: [
          [
            "Date",
            "Calories",
            "Protein (g)",
            "Carbs (g)",
            "Fat (g)",
            "Fiber (g)",
            "Sugar (g)",
            "Meals",
          ],
        ],
        body: tableData,
        startY: 170,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 8 },
      });

      pdf.save(`nutrition-analysis-${format(new Date(), "yyyy-MM-dd")}.pdf`);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const totalDays = nutritionData.length;
  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const avgCalories = avg(nutritionData.map((d) => d.calories));
  const avgProtein = avg(nutritionData.map((d) => d.protein));
  const avgCarbs = avg(nutritionData.map((d) => d.carbs));
  const avgFat = avg(nutritionData.map((d) => d.fat));
  const avgFiber = avg(nutritionData.map((d) => d.fiber));
  const avgSugar = avg(nutritionData.map((d) => d.sugar));

  const totalMacroCalories = avgProtein * 4 + avgCarbs * 4 + avgFat * 9;
  const macroData: MacroData[] = [
    {
      name: "Protein",
      value: Number((avgProtein * 4).toFixed(1)),
      color: "#3b82f6",
      percentage:
        totalMacroCalories > 0
          ? Number((((avgProtein * 4) / totalMacroCalories) * 100).toFixed(1))
          : 0,
    },
    {
      name: "Carbs",
      value: Number((avgCarbs * 4).toFixed(1)),
      color: "#f59e0b",
      percentage:
        totalMacroCalories > 0
          ? Number((((avgCarbs * 4) / totalMacroCalories) * 100).toFixed(1))
          : 0,
    },
    {
      name: "Fat",
      value: Number((avgFat * 9).toFixed(1)),
      color: "#ef4444",
      percentage:
        totalMacroCalories > 0
          ? Number((((avgFat * 9) / totalMacroCalories) * 100).toFixed(1))
          : 0,
    },
  ];

  const flowData = nutritionData.map((day, index) => ({
    ...day,
    trend:
      index > 0
        ? Number((day.calories - nutritionData[index - 1].calories).toFixed(1))
        : 0,
    target: 2000,
  }));

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6 ">
      {/* Header with Date Controls */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <CustomDateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
            />
            <QuickSelect
              onSelect={handleQuickSelect}
              selectedValue={selectedPreset}
            />
          </div>
          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">Avg Calories</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {avgCalories.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Target: 2000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">Avg Protein</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {avgProtein.toFixed(1)}g
                </p>
                <p className="text-xs text-muted-foreground">Target: 150g</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">Avg Carbs</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {avgCarbs.toFixed(1)}g
                </p>
                <p className="text-xs text-muted-foreground">Target: 250g</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">Avg Fiber</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {avgFiber.toFixed(1)}g
                </p>
                <p className="text-xs text-muted-foreground">Target: 30g</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-purple-500 rounded-full flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">Avg Sugar</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {avgSugar.toFixed(1)}g
                </p>
                <p className="text-xs text-muted-foreground">Limit: 50g</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calorie Flow Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Calorie Intake Flow Analysis</CardTitle>
          <CardDescription>
            Daily calorie consumption with target comparison and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] sm:h-[400px] w-full">
            {nutritionData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No data available for the selected date range.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={flowData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(tick) => format(new Date(tick), "MM/dd")}
                  />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    labelFormatter={(label) =>
                      format(new Date(label), "MMM dd, yyyy")
                    }
                    formatter={(value: number, name: string) => {
                      if (name === "calories")
                        return [`${value.toFixed(1)} kcal`, "Calories"];
                      if (name === "target")
                        return [`${value.toFixed(1)} kcal`, "Target"];
                      return [value, name];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    fill="url(#calorieGradient)"
                    fillOpacity={0.3}
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <defs>
                    <linearGradient
                      id="calorieGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Macronutrient Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Macronutrient Analysis</CardTitle>
            <CardDescription>
              Stacked daily intake with trend analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[350px] w-full">
              {nutritionData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No data available for the selected date range.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={nutritionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(tick) => format(new Date(tick), "MM/dd")}
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                      labelFormatter={(label) =>
                        format(new Date(label), "MMM dd, yyyy")
                      }
                      formatter={(value: number, name: string) => [
                        `${Number(value).toFixed(1)}g`,
                        name.charAt(0).toUpperCase() + name.slice(1),
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="protein"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="carbs"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="fat"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calorie Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Macronutrient Calorie Distribution</CardTitle>
            <CardDescription>
              Percentage breakdown of calories from macros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[350px] w-full">
              {nutritionData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No data available for the selected date range.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) =>
                        `${name}: ${percentage.toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      formatter={(value: number, name: string) => [
                        `${Number(value).toFixed(1)} kcal`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {macroData.map((macro) => (
                <div
                  key={macro.name}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: macro.color }}
                    />
                    <span className="text-sm font-medium">{macro.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {macro.value.toFixed(1)} kcal ({macro.percentage.toFixed(1)}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fiber and Sugar Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fiber Intake Analysis</CardTitle>
            <CardDescription>
              Daily fiber with target comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {nutritionData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No data available for the selected date range.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={nutritionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(tick) => format(new Date(tick), "MM/dd")}
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                      labelFormatter={(label) =>
                        format(new Date(label), "MMM dd, yyyy")
                      }
                      formatter={(value: number, name: string) => [
                        `${Number(value).toFixed(1)}g`,
                        name === "fiber" ? "Fiber" : "Target",
                      ]}
                    />
                    <Bar dataKey="fiber" fill="#10b981" fillOpacity={0.7} />
                    <Line
                      type="monotone"
                      dataKey={() => 30}
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sugar Intake Monitoring</CardTitle>
            <CardDescription>Daily sugar with limit tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {nutritionData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No data available for the selected date range.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={nutritionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(tick) => format(new Date(tick), "MM/dd")}
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                      labelFormatter={(label) =>
                        format(new Date(label), "MMM dd, yyyy")
                      }
                      formatter={(value: number, name: string) => [
                        `${Number(value).toFixed(1)}g`,
                        name === "sugar" ? "Sugar" : "Limit",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="sugar"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                    <Line
                      type="monotone"
                      dataKey={() => 50}
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Statistics with Progress Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Nutrition Dashboard</CardTitle>
          <CardDescription>
            Detailed analysis with target achievement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              {
                name: "Calories",
                value: avgCalories,
                unit: "kcal",
                target: 2000,
                color: "bg-primary",
                icon: TrendingUp,
              },
              {
                name: "Protein",
                value: avgProtein,
                unit: "g",
                target: 150,
                color: "bg-blue-500",
                icon: Target,
              },
              {
                name: "Carbs",
                value: avgCarbs,
                unit: "g",
                target: 250,
                color: "bg-amber-500",
                icon: Zap,
              },
              {
                name: "Fat",
                value: avgFat,
                unit: "g",
                target: 70,
                color: "bg-red-500",
                icon: Activity,
              },
              {
                name: "Fiber",
                value: avgFiber,
                unit: "g",
                target: 30,
                color: "bg-green-500",
                icon: Activity,
              },
              {
                name: "Sugar",
                value: avgSugar,
                unit: "g",
                target: 50,
                color: "bg-purple-500",
                icon: Activity,
              },
            ].map((nutrient) => {
              const percentage = Math.min(
                (nutrient.value / nutrient.target) * 100,
                100
              );
              const Icon = nutrient.icon;
              return (
                <div key={nutrient.name} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-sm truncate">
                      {nutrient.name}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold">
                      {nutrient.value.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {nutrient.unit}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${nutrient.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage.toFixed(0)}%</span>
                      <span>Target: {nutrient.target}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-[320px]" />
            <Skeleton className="h-10 w-full sm:w-[180px]" />
          </div>
          <Skeleton className="h-10 w-full sm:w-[120px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
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
