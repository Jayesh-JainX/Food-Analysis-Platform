import React, { useState, useEffect } from "react";
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  Trophy,
  Zap,
  Users,
  Brain,
  Heart,
  Dumbbell,
  Apple,
  Timer,
  Star,
  ChevronRight,
  BarChart3,
  Camera,
  Play,
  Pause,
  Check,
  X,
  Share,
  Medal,
  Flame,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Edit3,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import SmartGoalWizard, {
  GoalFormData,
} from "@/components/goal-planner/SmartGoalWizard";
import ProgressTracker from "@/components/goal-planner/ProgressTracker";
import MilestonesManager from "@/components/goal-planner/MilestonesManager";
import { goalTypes } from "@/data/goalTypes";

// Types
interface Goal {
  id: string;
  title: string;
  description: string;
  goal_type: string;
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  start_date: string;
  target_date: string;
  estimated_duration_weeks: number;
  current_weight?: number;
  target_weight?: number;
  completion_percentage: number;
  streak_days: number;
  total_points: number;
  created_at: string;
}

interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  description: string;
  week_number: number;
  status: "pending" | "in_progress" | "completed" | "skipped";
  target_value: number;
  unit: string;
  due_date: string;
}

interface ProgressEntry {
  id: string;
  goal_id: string;
  metric_type: string;
  value: number;
  unit: string;
  measurement_date: string;
  notes?: string;
}

const GoalPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showGoalWizard, setShowGoalWizard] = useState(false);
  const [selectedGoalType, setSelectedGoalType] = useState<string>("");
  const [wizardStep, setWizardStep] = useState(1);
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    goal_type: "",
    priority: "medium",
    start_date: new Date().toISOString().split("T")[0],
    target_date: "",
    current_weight: "",
    target_weight: "",
    custom_targets: {},
  });
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // Load goals on component mount
  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
      // Initialize selected goal if not set
      if (!selectedGoalId && (data || []).length > 0) {
        const active = (data || []).find((g: any) => g.status === "active");
        setSelectedGoalId(active ? active.id : (data as any)[0].id);
      }
    } catch (error) {
      console.error("Error loading goals:", error);
      toast({
        title: "Error",
        description: "Failed to load your goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startGoalWizard = (goalType: string) => {
    setSelectedGoalType(goalType);
    const selectedType = goalTypes.find((t) => t.id === goalType);
    if (selectedType) {
      setGoalForm({
        ...goalForm,
        goal_type: goalType,
        title: selectedType.name,
        description: selectedType.description,
        target_date: new Date(
          Date.now() + selectedType.estimatedWeeks * 7 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
      });
    }
    setShowGoalWizard(true);
  };

  const createGoal = async () => {
    try {
      const { data, error } = await supabase
        .from("goals")
        .insert([
          {
            user_id: user?.id,
            ...goalForm,
            current_weight: goalForm.current_weight
              ? parseFloat(goalForm.current_weight)
              : null,
            target_weight: goalForm.target_weight
              ? parseFloat(goalForm.target_weight)
              : null,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setGoals([data, ...goals]);
      setShowGoalWizard(false);
      setWizardStep(1);
      setGoalForm({
        title: "",
        description: "",
        goal_type: "",
        priority: "medium",
        start_date: new Date().toISOString().split("T")[0],
        target_date: "",
        current_weight: "",
        target_weight: "",
        custom_targets: {},
      });

      toast({
        title: "Success!",
        description: "Your goal has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const GoalWizardStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Choose Your Goal Type</h3>
        <p className="text-gray-600">
          Select the type of goal you want to achieve
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {goalTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                selectedGoalType === type.id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() => startGoalWizard(type.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${type.color}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm">{type.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {type.estimatedWeeks} weeks
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-2">{type.description}</p>
                <Badge
                  variant={
                    type.difficulty === "Easy"
                      ? "default"
                      : type.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {type.difficulty}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const GoalWizardStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Customize Your Goal</h3>
        <p className="text-gray-600">
          Set up your specific targets and timeline
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={goalForm.title}
              onChange={(e) =>
                setGoalForm({ ...goalForm, title: e.target.value })
              }
              placeholder="Enter a custom title for your goal"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={goalForm.description}
              onChange={(e) =>
                setGoalForm({ ...goalForm, description: e.target.value })
              }
              placeholder="Describe your goal in detail"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select
              value={goalForm.priority}
              onValueChange={(value) =>
                setGoalForm({ ...goalForm, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="critical">Critical Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={goalForm.start_date}
              onChange={(e) =>
                setGoalForm({ ...goalForm, start_date: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="target_date">Target Date</Label>
            <Input
              id="target_date"
              type="date"
              value={goalForm.target_date}
              onChange={(e) =>
                setGoalForm({ ...goalForm, target_date: e.target.value })
              }
            />
          </div>

          {(selectedGoalType === "fat_loss" ||
            selectedGoalType === "muscle_gain" ||
            selectedGoalType === "lean_body") && (
            <>
              <div>
                <Label htmlFor="current_weight">Current Weight (kg)</Label>
                <Input
                  id="current_weight"
                  type="number"
                  value={goalForm.current_weight}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, current_weight: e.target.value })
                  }
                  placeholder="Enter your current weight"
                />
              </div>

              <div>
                <Label htmlFor="target_weight">Target Weight (kg)</Label>
                <Input
                  id="target_weight"
                  type="number"
                  value={goalForm.target_weight}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, target_weight: e.target.value })
                  }
                  placeholder="Enter your target weight"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => setWizardStep(1)}>
          Back
        </Button>
        <Button onClick={createGoal} className="flex items-center space-x-2">
          <Target className="h-4 w-4" />
          <span>Create Goal</span>
        </Button>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.filter((g) => g.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {goals.filter((g) => g.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...goals.map((g) => g.streak_days), 0)}
            </div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.reduce((total, goal) => total + goal.total_points, 0)}
            </div>
            <p className="text-xs text-muted-foreground">earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.length > 0
                ? Math.round(
                    goals.reduce((sum, g) => sum + g.completion_percentage, 0) /
                      goals.length
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Get started with your fitness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex flex-col h-20 "
              onClick={() => setShowGoalWizard(true)}
            >
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-sm">New Goal</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col h-20 "
              onClick={() => {
                const activeGoal =
                  goals.find((g) => g.status === "active") ||
                  (selectedGoalId
                    ? goals.find((g) => g.id === selectedGoalId)
                    : null);
                if (activeGoal) {
                  setActiveTab("progress");
                } else {
                  toast({
                    title: "No Active Goal",
                    description:
                      "Create a goal first to track progress photos.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Camera className="h-5 w-5 mb-1" />
              <span className="text-sm">Progress Photo</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col h-20 "
              onClick={() => {
                const activeGoal =
                  goals.find((g) => g.status === "active") ||
                  (selectedGoalId
                    ? goals.find((g) => g.id === selectedGoalId)
                    : null);
                if (activeGoal) {
                  setActiveTab("progress");
                } else {
                  toast({
                    title: "No Active Goal",
                    description: "Create a goal first to log progress.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <BarChart3 className="h-5 w-5 mb-1" />
              <span className="text-sm">Log Progress</span>
            </Button>

            <Link to="/ai-chat">
              <Button variant="outline" className="flex flex-col h-20 w-full ">
                <Brain className="h-5 w-5 mb-1" />
                <span className="text-sm">Ask Health AI</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>
            Track your progress and stay motivated
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Goals Yet</h3>
              <p className="text-gray-600 mb-4">
                Start your fitness journey by creating your first goal
              </p>
              <Button
                onClick={() => setShowGoalWizard(true)}
                className="wellness-gradient"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.slice(0, 5).map((goal) => {
                const goalType = goalTypes.find((t) => t.id === goal.goal_type);
                const IconComponent = goalType?.icon || Target;

                return (
                  <Card
                    key={goal.id}
                    className="hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-primary/30"
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setActiveTab("progress");
                    }}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div
                            className={`p-2 sm:p-3 rounded-xl ${
                              goalType?.color || "bg-primary"
                            } shadow-sm shrink-0`}
                          >
                            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2 sm:mb-3">
                              <div className="min-w-0 flex-1 mr-2">
                                <h4 className="font-semibold text-sm sm:text-base line-clamp-1">
                                  {goal.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-1">
                                  {goal.description}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  goal.status === "active"
                                    ? "default"
                                    : goal.status === "completed"
                                    ? "secondary"
                                    : goal.status === "paused"
                                    ? "outline"
                                    : "destructive"
                                }
                                className="shrink-0 text-xs"
                              >
                                {goal.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="sm:hidden">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedGoalId(goal.id);
                                setActiveTab("progress");
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3 flex-1">
                          <div>
                            <div className="flex items-center justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                              <span className="text-muted-foreground">
                                Progress
                              </span>
                              <span className="font-medium">
                                {Math.round(goal.completion_percentage)}%
                              </span>
                            </div>
                            <Progress
                              value={goal.completion_percentage}
                              className="h-2 sm:h-2.5"
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center truncate">
                              <Clock className="h-3 w-3 mr-1 shrink-0" />
                              <span className="truncate">
                                Due{" "}
                                {new Date(
                                  goal.target_date
                                ).toLocaleDateString()}
                              </span>
                            </span>
                            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-2">
                              <span className="flex items-center">
                                <Flame className="h-3 w-3 mr-1 text-orange-500" />
                                {goal.streak_days}
                              </span>
                              <span className="flex items-center">
                                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                {goal.total_points}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="hidden sm:flex flex-col space-y-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGoalId(goal.id);
                              setActiveTab("progress");
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const ProgressTab = () => {
    const goal = selectedGoalId
      ? goals.find((g) => g.id === selectedGoalId)
      : goals.find((g) => g.status === "active");
    return (
      <div className="space-y-6">
        {goal ? (
          <ProgressTracker goalId={goal.id} goal={goal as any} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your achievements and track your journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Goals</h3>
                <p className="text-gray-600 mb-4">
                  Create a goal to start tracking your progress
                </p>
                <Button
                  onClick={() => setShowGoalWizard(true)}
                  className="wellness-gradient"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const MilestonesTab = () => {
    const goal = selectedGoalId
      ? goals.find((g) => g.id === selectedGoalId)
      : goals.find((g) => g.status === "active");
    return (
      <div className="space-y-6">
        {goal ? (
          <MilestonesManager goalId={goal.id} goal={goal as any} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Milestones & Achievements</CardTitle>
              <CardDescription>
                Celebrate your wins and track your milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Goals</h3>
                <p className="text-gray-600 mb-4">
                  Create a goal to see your milestones and achievements
                </p>
                <Button
                  onClick={() => setShowGoalWizard(true)}
                  className="wellness-gradient"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const PlansTab = () => {
    const goal = selectedGoalId
      ? goals.find((g) => g.id === selectedGoalId)
      : goals.find((g) => g.status === "active");

    const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
    const [mealPlans, setMealPlans] = useState<any[]>([]);
    const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
    const [showAddWorkout, setShowAddWorkout] = useState<boolean>(false);
    const [showAddMeal, setShowAddMeal] = useState<boolean>(false);
    const [editingWorkout, setEditingWorkout] = useState<any>(null);
    const [editingMeal, setEditingMeal] = useState<any>(null);
    const [newWorkout, setNewWorkout] = useState({
      name: "",
      description: "",
      difficulty: "beginner",
      duration_weeks: 4,
      workouts_per_week: 3,
    });
    const [newMeal, setNewMeal] = useState({
      name: "",
      description: "",
      plan_type: "maintenance",
      daily_calories: 2000,
    });

    useEffect(() => {
      const loadPlans = async () => {
        if (!goal) return;
        try {
          setLoadingPlans(true);
          const [{ data: wp }, { data: mp }] = await Promise.all([
            supabase
              .from("goal_workout_plans")
              .select("*")
              .eq("goal_id", goal.id)
              .order("created_at", { ascending: false }),
            supabase
              .from("goal_meal_plans")
              .select("*")
              .eq("goal_id", goal.id)
              .order("created_at", { ascending: false }),
          ]);
          setWorkoutPlans(wp || []);
          setMealPlans(mp || []);
        } finally {
          setLoadingPlans(false);
        }
      };
      loadPlans();
    }, [goal?.id]);

    const createWorkoutPlan = async () => {
      if (!goal) return;
      const { data, error } = await supabase
        .from("goal_workout_plans")
        .insert([
          {
            goal_id: goal.id,
            name: newWorkout.name || "Custom Workout Plan",
            description: newWorkout.description || null,
            difficulty: newWorkout.difficulty,
            duration_weeks: newWorkout.duration_weeks,
            workouts_per_week: newWorkout.workouts_per_week,
            is_active: true,
          },
        ])
        .select()
        .single();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to create workout plan",
          variant: "destructive",
        });
        return;
      }
      setWorkoutPlans([data, ...workoutPlans]);
      setShowAddWorkout(false);
      setNewWorkout({
        name: "",
        description: "",
        difficulty: "beginner",
        duration_weeks: 4,
        workouts_per_week: 3,
      });
      toast({ title: "Workout plan created" });
    };

    const editWorkoutPlan = async () => {
      if (!editingWorkout) return;
      const { data, error } = await supabase
        .from("goal_workout_plans")
        .update({
          name: editingWorkout.name,
          description: editingWorkout.description,
          difficulty: editingWorkout.difficulty,
          duration_weeks: editingWorkout.duration_weeks,
          workouts_per_week: editingWorkout.workouts_per_week,
        })
        .eq("id", editingWorkout.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update workout plan",
          variant: "destructive",
        });
        return;
      }

      setWorkoutPlans(
        workoutPlans.map((wp) => (wp.id === editingWorkout.id ? data : wp))
      );
      setEditingWorkout(null);
      toast({ title: "Workout plan updated" });
    };

    const deleteWorkoutPlan = async (id: string) => {
      const { error } = await supabase
        .from("goal_workout_plans")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete workout plan",
          variant: "destructive",
        });
        return;
      }

      setWorkoutPlans(workoutPlans.filter((wp) => wp.id !== id));
      toast({ title: "Workout plan deleted" });
    };

    const createMealPlan = async () => {
      if (!goal) return;
      const { data, error } = await supabase
        .from("goal_meal_plans")
        .insert([
          {
            goal_id: goal.id,
            name: newMeal.name || "Custom Meal Plan",
            description: newMeal.description || null,
            plan_type: newMeal.plan_type,
            daily_calories: newMeal.daily_calories,
            is_active: true,
          },
        ])
        .select()
        .single();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to create meal plan",
          variant: "destructive",
        });
        return;
      }
      setMealPlans([data, ...mealPlans]);
      setShowAddMeal(false);
      setNewMeal({
        name: "",
        description: "",
        plan_type: "maintenance",
        daily_calories: 2000,
      });
      toast({ title: "Meal plan created" });
    };

    const editMealPlan = async () => {
      if (!editingMeal) return;
      const { data, error } = await supabase
        .from("goal_meal_plans")
        .update({
          name: editingMeal.name,
          description: editingMeal.description,
          plan_type: editingMeal.plan_type,
          daily_calories: editingMeal.daily_calories,
        })
        .eq("id", editingMeal.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update meal plan",
          variant: "destructive",
        });
        return;
      }

      setMealPlans(
        mealPlans.map((mp) => (mp.id === editingMeal.id ? data : mp))
      );
      setEditingMeal(null);
      toast({ title: "Meal plan updated" });
    };

    const deleteMealPlan = async (id: string) => {
      const { error } = await supabase
        .from("goal_meal_plans")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete meal plan",
          variant: "destructive",
        });
        return;
      }

      setMealPlans(mealPlans.filter((mp) => mp.id !== id));
      toast({ title: "Meal plan deleted" });
    };

    return (
      <div className="space-y-6">
        {!goal ? (
          <Card>
            <CardHeader>
              <CardTitle>Workout & Meal Plans</CardTitle>
              <CardDescription>
                Celebrate your wins and track your milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Dumbbell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium mb-2">No Active Goals</h4>
              <p className="text-gray-600 mb-4">
                Create a goal to get personalized workout and meal plans
              </p>
              <Button
                onClick={() => setShowGoalWizard(true)}
                className="wellness-gradient"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Dumbbell className="h-5 w-5" />
                  <span>Workout Plans</span>
                </CardTitle>
                <CardDescription>
                  Customized workout routines for your goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPlans ? (
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : workoutPlans.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">No workout plans yet</p>
                    <Button
                      className="wellness-gradient"
                      onClick={() => setShowAddWorkout(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Plan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workoutPlans.map((wp) => (
                      <div
                        key={wp.id}
                        className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 mr-3">
                            <div className="font-medium text-sm sm:text-base truncate">
                              {wp.name}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                              {wp.description || "No description"}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            <Badge
                              variant={wp.is_active ? "default" : "outline"}
                              className="text-xs"
                            >
                              {wp.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                setEditingWorkout(wp);
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              onClick={() => {
                                deleteWorkoutPlan(wp.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <Button
                        className="wellness-gradient"
                        onClick={() => setShowAddWorkout(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Workout Plan
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Apple className="h-5 w-5" />
                  <span>Meal Plans</span>
                </CardTitle>
                <CardDescription>
                  Nutrition plans tailored to your goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPlans ? (
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : mealPlans.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">No meal plans yet</p>
                    <Button
                      className="wellness-gradient"
                      onClick={() => setShowAddMeal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Plan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mealPlans.map((mp) => (
                      <div
                        key={mp.id}
                        className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 mr-3">
                            <div className="font-medium text-sm sm:text-base truncate">
                              {mp.name}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                              {mp.description || "No description"}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            <Badge
                              variant={mp.is_active ? "default" : "outline"}
                              className="text-xs"
                            >
                              {mp.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                setEditingMeal(mp);
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              onClick={() => {
                                deleteMealPlan(mp.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <Button
                        className="wellness-gradient"
                        onClick={() => setShowAddMeal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Meal Plan
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workout Plan Dialog */}
            <Dialog open={showAddWorkout} onOpenChange={setShowAddWorkout}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Workout Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newWorkout.name}
                      onChange={(e) =>
                        setNewWorkout({ ...newWorkout, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newWorkout.description}
                      onChange={(e) =>
                        setNewWorkout({
                          ...newWorkout,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Difficulty</Label>
                      <Select
                        value={newWorkout.difficulty}
                        onValueChange={(v) =>
                          setNewWorkout({ ...newWorkout, difficulty: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Duration (weeks)</Label>
                      <Input
                        type="number"
                        value={newWorkout.duration_weeks}
                        onChange={(e) =>
                          setNewWorkout({
                            ...newWorkout,
                            duration_weeks: parseInt(e.target.value) || 4,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Workouts / week</Label>
                      <Input
                        type="number"
                        value={newWorkout.workouts_per_week}
                        onChange={(e) =>
                          setNewWorkout({
                            ...newWorkout,
                            workouts_per_week: parseInt(e.target.value) || 3,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      className="wellness-gradient"
                      onClick={() => setShowAddWorkout(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="wellness-gradient"
                      onClick={createWorkoutPlan}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Meal Plan Dialog */}
            <Dialog open={showAddMeal} onOpenChange={setShowAddMeal}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Meal Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newMeal.name}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newMeal.description}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Plan Type</Label>
                      <Select
                        value={newMeal.plan_type}
                        onValueChange={(v) =>
                          setNewMeal({ ...newMeal, plan_type: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="weight_loss">
                            Weight Loss
                          </SelectItem>
                          <SelectItem value="muscle_gain">
                            Muscle Gain
                          </SelectItem>
                          <SelectItem value="keto">Keto</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Daily Calories</Label>
                      <Input
                        type="number"
                        value={newMeal.daily_calories}
                        onChange={(e) =>
                          setNewMeal({
                            ...newMeal,
                            daily_calories: parseInt(e.target.value) || 2000,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      className="wellness-gradient"
                      onClick={() => setShowAddMeal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="wellness-gradient"
                      onClick={createMealPlan}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Workout Plan Dialog */}
            <Dialog
              open={!!editingWorkout}
              onOpenChange={() => setEditingWorkout(null)}
            >
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Workout Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={editingWorkout?.name || ""}
                      onChange={(e) =>
                        setEditingWorkout({
                          ...editingWorkout,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editingWorkout?.description || ""}
                      onChange={(e) =>
                        setEditingWorkout({
                          ...editingWorkout,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Difficulty</Label>
                      <Select
                        value={editingWorkout?.difficulty || "beginner"}
                        onValueChange={(v) =>
                          setEditingWorkout({
                            ...editingWorkout,
                            difficulty: v,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Duration (weeks)</Label>
                      <Input
                        type="number"
                        value={editingWorkout?.duration_weeks || 4}
                        onChange={(e) =>
                          setEditingWorkout({
                            ...editingWorkout,
                            duration_weeks: parseInt(e.target.value) || 4,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Workouts / week</Label>
                      <Input
                        type="number"
                        value={editingWorkout?.workouts_per_week || 3}
                        onChange={(e) =>
                          setEditingWorkout({
                            ...editingWorkout,
                            workouts_per_week: parseInt(e.target.value) || 3,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      className="wellness-gradient"
                      onClick={() => setEditingWorkout(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="wellness-gradient"
                      onClick={editWorkoutPlan}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Meal Plan Dialog */}
            <Dialog
              open={!!editingMeal}
              onOpenChange={() => setEditingMeal(null)}
            >
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Meal Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={editingMeal?.name || ""}
                      onChange={(e) =>
                        setEditingMeal({ ...editingMeal, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editingMeal?.description || ""}
                      onChange={(e) =>
                        setEditingMeal({
                          ...editingMeal,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Plan Type</Label>
                      <Select
                        value={editingMeal?.plan_type || "maintenance"}
                        onValueChange={(v) =>
                          setEditingMeal({ ...editingMeal, plan_type: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight_loss">
                            Weight Loss
                          </SelectItem>
                          <SelectItem value="weight_gain">
                            Weight Gain
                          </SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="muscle_gain">
                            Muscle Gain
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Daily Calories</Label>
                      <Input
                        type="number"
                        value={editingMeal?.daily_calories || 2000}
                        onChange={(e) =>
                          setEditingMeal({
                            ...editingMeal,
                            daily_calories: parseInt(e.target.value) || 2000,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      className="wellness-gradient"
                      onClick={() => setEditingMeal(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="wellness-gradient"
                      onClick={editMealPlan}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold">Goal Planner</h1>
          <p className="text-muted-foreground mt-1">
            Plan, track, and achieve your fitness and health goals
          </p>
        </div>

        <Button
          onClick={() => setShowGoalWizard(true)}
          className=" flex items-center space-x-1 wellness-gradient"
        >
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 my-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressTab />
        </TabsContent>

        <TabsContent value="milestones">
          <MilestonesTab />
        </TabsContent>

        <TabsContent value="plans">
          <PlansTab />
        </TabsContent>
      </Tabs>

      {/* Goal Wizard Dialog */}
      <Dialog open={showGoalWizard} onOpenChange={setShowGoalWizard}>
        <DialogContent className="max-w-[90vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-2xl">
              <Target className="h-6 w-6" />
              <span>What's Your Goal?</span>
            </DialogTitle>
            <DialogDescription className="text-lg">
              Let's create your personalized fitness journey
            </DialogDescription>
          </DialogHeader>
          <SmartGoalWizard
            onComplete={async (data) => {
              try {
                const payload = {
                  user_id: user?.id,
                  title: data.title,
                  description: data.description,
                  goal_type: data.goal_type,
                  priority: data.priority,
                  start_date: data.start_date,
                  target_date: data.target_date,
                  estimated_duration_weeks: data.estimated_duration_weeks,
                  current_weight: data.current_weight ?? null,
                  target_weight: data.target_weight ?? null,
                  status: "active",
                };

                const { data: inserted, error } = await supabase
                  .from("goals")
                  .insert([payload])
                  .select()
                  .single();

                if (error) throw error;

                setGoals([inserted, ...goals]);
                setShowGoalWizard(false);
                toast({
                  title: "Success!",
                  description: "Your goal has been created successfully.",
                });
              } catch (err) {
                console.error("Error creating goal:", err);
                toast({
                  title: "Error",
                  description: "Failed to create goal. Please try again.",
                  variant: "destructive",
                });
              }
            }}
            onClose={() => setShowGoalWizard(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalPlannerPage;
