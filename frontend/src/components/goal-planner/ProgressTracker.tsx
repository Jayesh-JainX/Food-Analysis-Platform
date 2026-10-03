import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  TrendingUp,
  Calendar,
  Plus,
  BarChart3,
  LineChart,
  Target,
  Scale,
  Ruler,
  Timer,
  Trophy,
  Upload,
  X,
  Edit3,
  Save,
  Eye,
  Download,
  Share,
  Trash2,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle2,
  AlertCircle,
  Star,
  Zap,
  Activity,
  TrendingDown,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Types
interface ProgressEntry {
  id: string;
  goal_id: string;
  metric_type: string;
  value: number;
  unit: string;
  notes?: string;
  before_photo_url?: string;
  after_photo_url?: string;
  comparison_notes?: string;
  measurement_date: string;
  recorded_at: string;
  source: string;
}

interface Goal {
  id: string;
  title: string;
  goal_type: string;
  current_weight?: number;
  target_weight?: number;
  current_body_fat?: number;
  target_body_fat?: number;
  start_date: string;
  target_date: string;
  completion_percentage: number;
}

interface MetricType {
  id: string;
  name: string;
  unit: string;
  icon: React.ComponentType<any>;
  category: "body" | "performance" | "health";
  description: string;
}

const metricTypes: MetricType[] = [
  {
    id: "weight",
    name: "Weight",
    unit: "kg",
    icon: Scale,
    category: "body",
    description: "Track your overall weight changes",
  },
  {
    id: "body_fat_percentage",
    name: "Body Fat %",
    unit: "%",
    icon: Target,
    category: "body",
    description: "Monitor body fat percentage",
  },
  {
    id: "muscle_mass",
    name: "Muscle Mass",
    unit: "kg",
    icon: Zap,
    category: "body",
    description: "Track muscle mass gains",
  },
  {
    id: "waist_circumference",
    name: "Waist",
    unit: "cm",
    icon: Ruler,
    category: "body",
    description: "Waist circumference measurement",
  },
  {
    id: "chest_circumference",
    name: "Chest",
    unit: "cm",
    icon: Ruler,
    category: "body",
    description: "Chest circumference measurement",
  },
  {
    id: "arm_circumference",
    name: "Arms",
    unit: "cm",
    icon: Ruler,
    category: "body",
    description: "Arm circumference measurement",
  },
  {
    id: "leg_circumference",
    name: "Legs",
    unit: "cm",
    icon: Ruler,
    category: "body",
    description: "Leg circumference measurement",
  },
  {
    id: "reps_count",
    name: "Max Reps",
    unit: "reps",
    icon: TrendingUp,
    category: "performance",
    description: "Maximum repetitions achieved",
  },
  {
    id: "weight_lifted",
    name: "Weight Lifted",
    unit: "kg",
    icon: Trophy,
    category: "performance",
    description: "Maximum weight lifted",
  },
  {
    id: "running_distance",
    name: "Running Distance",
    unit: "km",
    icon: Timer,
    category: "performance",
    description: "Distance covered running",
  },
  {
    id: "running_time",
    name: "Running Time",
    unit: "min",
    icon: Timer,
    category: "performance",
    description: "Time taken for set distance",
  },
  {
    id: "flexibility_score",
    name: "Flexibility",
    unit: "score",
    icon: Star,
    category: "health",
    description: "Flexibility assessment score",
  },
  {
    id: "stress_level",
    name: "Stress Level",
    unit: "scale",
    icon: AlertCircle,
    category: "health",
    description: "Stress level (1-10 scale)",
  },
  {
    id: "sleep_quality",
    name: "Sleep Quality",
    unit: "hours",
    icon: Timer,
    category: "health",
    description: "Hours of quality sleep",
  },
  {
    id: "energy_level",
    name: "Energy Level",
    unit: "scale",
    icon: Zap,
    category: "health",
    description: "Energy level (1-10 scale)",
  },
];

interface ProgressTrackerProps {
  goalId: string;
  goal: Goal;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ goalId, goal }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState<string>("");
  const [activeSection, setActiveSection] = useState("overview");
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [editingEntry, setEditingEntry] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState({
    metric_type: "",
    value: "",
    unit: "",
    notes: "",
    measurement_date: new Date().toISOString().split("T")[0],
    before_photo: null as File | null,
    after_photo: null as File | null,
    comparison_notes: "",
  });

  useEffect(() => {
    if (goalId) {
      loadProgressEntries();
    }
  }, [goalId]);

  const loadProgressEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("goal_progress")
        .select("*")
        .eq("goal_id", goalId)
        .order("measurement_date", { ascending: false });

      if (error) throw error;
      setProgressEntries(data || []);
    } catch (error) {
      console.error("Error loading progress entries:", error);
      toast({
        title: "Error",
        description: "Failed to load progress entries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (
    file: File,
    path: string
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("food-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("food-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading photo:", error);
      return null;
    }
  };

  const addProgressEntry = async () => {
    try {
      if (!newEntry.metric_type || !newEntry.value) {
        toast({
          title: "Missing Information",
          description: "Please select a metric type and enter a value.",
          variant: "destructive",
        });
        return;
      }

      const metricType = metricTypes.find((m) => m.id === newEntry.metric_type);
      if (!metricType) return;

      let beforePhotoUrl = null;
      let afterPhotoUrl = null;

      // Upload photos if provided
      if (newEntry.before_photo) {
        beforePhotoUrl = await uploadPhoto(
          newEntry.before_photo,
          "progress/before"
        );
      }
      if (newEntry.after_photo) {
        afterPhotoUrl = await uploadPhoto(
          newEntry.after_photo,
          "progress/after"
        );
      }

      const { data, error } = await supabase
        .from("goal_progress")
        .insert([
          {
            goal_id: goalId,
            user_id: user?.id,
            metric_type: newEntry.metric_type,
            value: parseFloat(newEntry.value),
            unit: metricType.unit,
            notes: newEntry.notes,
            before_photo_url: beforePhotoUrl,
            after_photo_url: afterPhotoUrl,
            comparison_notes: newEntry.comparison_notes,
            measurement_date: newEntry.measurement_date,
            source: "manual",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProgressEntries([data, ...progressEntries]);
      setShowAddProgress(false);
      setNewEntry({
        metric_type: "",
        value: "",
        unit: "",
        notes: "",
        measurement_date: new Date().toISOString().split("T")[0],
        before_photo: null,
        after_photo: null,
        comparison_notes: "",
      });

      toast({
        title: "Success!",
        description: "Progress entry added successfully.",
      });
    } catch (error) {
      console.error("Error adding progress entry:", error);
      toast({
        title: "Error",
        description: "Failed to add progress entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteProgressEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from("goal_progress")
        .delete()
        .eq("id", entryId);

      if (error) throw error;

      setProgressEntries(
        progressEntries.filter((entry) => entry.id !== entryId)
      );
      toast({
        title: "Deleted",
        description: "Progress entry deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting progress entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete progress entry.",
        variant: "destructive",
      });
    }
  };

  const getProgressTrend = (metricType: string) => {
    const entries = progressEntries
      .filter((entry) => entry.metric_type === metricType)
      .sort(
        (a, b) =>
          new Date(a.measurement_date).getTime() -
          new Date(b.measurement_date).getTime()
      );

    if (entries.length < 2) return null;

    const first = entries[0];
    const last = entries[entries.length - 1];
    const change = last.value - first.value;
    const percentChange = (change / first.value) * 100;

    return {
      change,
      percentChange,
      isPositive: change > 0,
      entries: entries.length,
    };
  };

  const getLatestValue = (metricType: string) => {
    const latest = progressEntries
      .filter((entry) => entry.metric_type === metricType)
      .sort(
        (a, b) =>
          new Date(b.measurement_date).getTime() -
          new Date(a.measurement_date).getTime()
      )[0];

    return latest?.value;
  };

  // Navigation Section Component
  const NavigationCard = ({
    id,
    title,
    description,
    icon: Icon,
    count,
    isActive,
    onClick,
  }: {
    id: string;
    title: string;
    description: string;
    icon: any;
    count?: number;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-md border ${
          isActive
            ? "border-primary shadow-sm"
            : "border-border hover:border-primary/50"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium text-sm sm:text-base ${
                  isActive ? "text-primary" : "text-foreground"
                }`}
              >
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                {description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <ArrowUp
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 ${
                  isActive ? "text-primary rotate-90" : "text-muted-foreground"
                }`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const OverviewTab = () => {
    const bodyMetrics = metricTypes.filter((m) => m.category === "body");
    const performanceMetrics = metricTypes.filter(
      (m) => m.category === "performance"
    );
    const healthMetrics = metricTypes.filter((m) => m.category === "health");

    const renderMetricCard = (metric: MetricType) => {
      const IconComponent = metric.icon;
      const latestValue = getLatestValue(metric.id);
      const trend = getProgressTrend(metric.id);

      return (
        <Card key={metric.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestValue ? `${latestValue} ${metric.unit}` : "--"}
            </div>
            {trend && (
              <div
                className={`flex items-center text-xs ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                <span>
                  {Math.abs(trend.percentChange).toFixed(1)}% from start
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {
                progressEntries.filter((e) => e.metric_type === metric.id)
                  .length
              }{" "}
              entries
            </p>
          </CardContent>
        </Card>
      );
    };

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressEntries.length}</div>
              <p className="text-xs text-muted-foreground">
                recorded measurements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Latest Entry
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progressEntries.length > 0
                  ? new Date(
                      progressEntries[0].measurement_date
                    ).toLocaleDateString()
                  : "--"}
              </div>
              <p className="text-xs text-muted-foreground">last measurement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Goal Progress
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(goal.completion_percentage)}%
              </div>
              <Progress
                value={goal.completion_percentage}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Photos</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  progressEntries.filter(
                    (e) => e.before_photo_url || e.after_photo_url
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">progress photos</p>
            </CardContent>
          </Card>
        </div>

        {/* Metric Categories */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Scale className="h-5 w-5" />
              <span>Body Measurements</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bodyMetrics.map(renderMetricCard)}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Performance Metrics</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map(renderMetricCard)}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Health & Wellness</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {healthMetrics.map(renderMetricCard)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EntriesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Progress Entries</h3>
        <Button
          onClick={() => setShowAddProgress(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Entry</span>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : progressEntries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-medium mb-2">No Progress Entries</h4>
            <p className="text-gray-600 mb-4">
              Start tracking your progress by adding your first measurement
            </p>
            <Button onClick={() => setShowAddProgress(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {progressEntries.map((entry) => {
            const metricType = metricTypes.find(
              (m) => m.id === entry.metric_type
            );
            const IconComponent = metricType?.icon || BarChart3;

            return (
              <Card
                key={entry.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{metricType?.name}</h4>
                        <Badge variant="outline">
                          {new Date(
                            entry.measurement_date
                          ).toLocaleDateString()}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-2xl font-bold text-blue-600">
                          {entry.value} {entry.unit}
                        </span>
                        {entry.notes && (
                          <span className="text-sm text-gray-600">
                            "{entry.notes}"
                          </span>
                        )}
                      </div>

                      {(entry.before_photo_url || entry.after_photo_url) && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Camera className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Progress photos attached
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedPhoto(
                                entry.before_photo_url ||
                                  entry.after_photo_url ||
                                  ""
                              );
                              setPhotoModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteProgressEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const PhotosTab = () => {
    const photoEntries = progressEntries.filter(
      (entry) => entry.before_photo_url || entry.after_photo_url
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Progress Photos</h3>
          <Button
            onClick={() => setShowAddProgress(true)}
            className="flex items-center space-x-2"
          >
            <Camera className="h-4 w-4" />
            <span>Add Photos</span>
          </Button>
        </div>

        {photoEntries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium mb-2">No Progress Photos</h4>
              <p className="text-gray-600 mb-4">
                Visual progress tracking helps you see changes that numbers
                can't show
              </p>
              <Button onClick={() => setShowAddProgress(true)}>
                <Camera className="h-4 w-4 mr-2" />
                Add First Photo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photoEntries.map((entry) => (
              <Card
                key={entry.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {new Date(entry.measurement_date).toLocaleDateString()}
                      </Badge>
                      <Badge variant="secondary">
                        {
                          metricTypes.find((m) => m.id === entry.metric_type)
                            ?.name
                        }
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {entry.before_photo_url && (
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">
                            Before
                          </Label>
                          <div
                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              setSelectedPhoto(entry.before_photo_url!);
                              setPhotoModalOpen(true);
                            }}
                          >
                            <img
                              src={entry.before_photo_url}
                              alt="Before"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {entry.after_photo_url && (
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">After</Label>
                          <div
                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              setSelectedPhoto(entry.after_photo_url!);
                              setPhotoModalOpen(true);
                            }}
                          >
                            <img
                              src={entry.after_photo_url}
                              alt="After"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {entry.comparison_notes && (
                      <p className="text-sm text-gray-600">
                        "{entry.comparison_notes}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewTab />;
      case "entries":
        return <EntriesTab />;
      case "photos":
        return <PhotosTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span>Progress</span>
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor your fitness journey
          </p>
        </div>

        <Button
          onClick={() => setShowAddProgress(true)}
          className="wellness-gradient flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Progress</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <NavigationCard
          id="overview"
          title="Overview"
          description="View progress metrics & trends"
          icon={BarChart3}
          count={metricTypes.length}
          isActive={activeSection === "overview"}
          onClick={() => setActiveSection("overview")}
        />

        <NavigationCard
          id="entries"
          title="Entries"
          description="Manage recorded measurements"
          icon={Activity}
          count={progressEntries.length}
          isActive={activeSection === "entries"}
          onClick={() => setActiveSection("entries")}
        />

        <NavigationCard
          id="photos"
          title="Photos"
          description="Before & after comparison"
          icon={Camera}
          count={
            progressEntries.filter(
              (e) => e.before_photo_url || e.after_photo_url
            ).length
          }
          isActive={activeSection === "photos"}
          onClick={() => setActiveSection("photos")}
        />
      </div>

      {/* Active Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-[400px]"
        >
          {renderActiveSection()}
        </motion.div>
      </AnimatePresence>

      {/* Add Progress Dialog */}
      <Dialog open={showAddProgress} onOpenChange={setShowAddProgress}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span>Add Progress Entry</span>
            </DialogTitle>
            <DialogDescription>
              Record your measurements and progress photos to track your journey
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metric_type">Metric Type</Label>
                <Select
                  value={newEntry.metric_type}
                  onValueChange={(value) => {
                    const metric = metricTypes.find((m) => m.id === value);
                    setNewEntry({
                      ...newEntry,
                      metric_type: value,
                      unit: metric?.unit || "",
                    });
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select metric to track" />
                  </SelectTrigger>
                  <SelectContent>
                    {metricTypes.map((metric) => {
                      const IconComponent = metric.icon;
                      return (
                        <SelectItem key={metric.id} value={metric.id}>
                          <div className="flex items-center space-x-3 py-1">
                            <IconComponent className="h-4 w-4" />
                            <div>
                              <span className="font-medium">{metric.name}</span>
                              <p className="text-xs text-gray-500">
                                {metric.description}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">Value</Label>
                <div className="flex space-x-2">
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    value={newEntry.value}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, value: e.target.value })
                    }
                    placeholder="Enter value"
                    className="h-12"
                  />
                  <Input
                    value={newEntry.unit}
                    readOnly
                    className="w-20 h-12 bg-gray-50"
                    placeholder="Unit"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="measurement_date">Measurement Date</Label>
              <Input
                id="measurement_date"
                type="date"
                value={newEntry.measurement_date}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, measurement_date: e.target.value })
                }
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={newEntry.notes}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, notes: e.target.value })
                }
                placeholder="Add any notes about this measurement..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="before_photo"
                  className="flex items-center space-x-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Before Photo (optional)</span>
                </Label>
                <Input
                  id="before_photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      before_photo: e.target.files?.[0] || null,
                    })
                  }
                  className="h-12"
                />
              </div>

              <div>
                <Label
                  htmlFor="after_photo"
                  className="flex items-center space-x-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>After Photo (optional)</span>
                </Label>
                <Input
                  id="after_photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      after_photo: e.target.files?.[0] || null,
                    })
                  }
                  className="h-12"
                />
              </div>
            </div>

            {(newEntry.before_photo || newEntry.after_photo) && (
              <div>
                <Label htmlFor="comparison_notes">
                  Photo Comparison Notes (optional)
                </Label>
                <Textarea
                  id="comparison_notes"
                  value={newEntry.comparison_notes}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      comparison_notes: e.target.value,
                    })
                  }
                  placeholder="Describe what you notice in the photos..."
                  rows={2}
                  className="resize-none"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowAddProgress(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={addProgressEntry}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Modal */}
      <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <span>Progress Photo</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center p-4">
            <img
              src={selectedPhoto}
              alt="Progress"
              className="max-w-full max-h-96 rounded-xl shadow-lg"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setPhotoModalOpen(false)}>
              Close
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressTracker;
