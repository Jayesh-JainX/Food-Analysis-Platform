import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Trophy,
  Medal,
  Star,
  Flame,
  Flag,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Timer,
  Zap,
  TrendingUp,
  BarChart3,
  Award,
  Gift,
  Sparkles,
  Save,
  X,
  CalendarDays,
  CheckSquare,
  SkipForward,
  Activity,
  ArrowUp,
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
} from "@/components/ui/dialog";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Types
interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  description: string;
  week_number?: number;
  day_number?: number;
  milestone_type: "weekly" | "daily" | "custom";
  target_value?: number;
  unit?: string;
  status: "pending" | "in_progress" | "completed" | "skipped";
  achieved_value?: number;
  achieved_at?: string;
  notes?: string;
  due_date?: string;
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

interface Goal {
  id: string;
  title: string;
  goal_type: string;
  start_date: string;
  target_date: string;
  completion_percentage: number;
  estimated_duration_weeks: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  achievement_type: string;
  points_awarded: number;
  badge_icon: string;
  badge_color: string;
  is_rare: boolean;
  difficulty_level: number;
  earned_at: string;
}

interface MilestonesManagerProps {
  goalId: string;
  goal: Goal;
}

const milestoneTemplates = {
  fat_loss: [
    {
      week: 1,
      title: "Initial Measurements",
      description: "Record starting weight, body fat %, and measurements",
      type: "measurement",
    },
    {
      week: 2,
      title: "Exercise Habit",
      description: "Complete 5 workouts this week",
      type: "activity",
    },
    {
      week: 4,
      title: "2% Body Weight Loss",
      description: "Lose 2% of starting body weight",
      type: "measurement",
    },
    {
      week: 6,
      title: "Nutrition Consistency",
      description: "Track all meals for 5 days",
      type: "habit",
    },
    {
      week: 8,
      title: "5% Body Weight Loss",
      description: "Lose 5% of starting body weight",
      type: "measurement",
    },
    {
      week: 10,
      title: "Strength Maintenance",
      description: "Maintain or improve strength levels",
      type: "performance",
    },
    {
      week: 12,
      title: "Target Achievement",
      description: "Reach target weight loss goal",
      type: "final",
    },
  ],
  muscle_gain: [
    {
      week: 1,
      title: "Baseline Strength",
      description: "Record current 1RM or max reps",
      type: "measurement",
    },
    {
      week: 2,
      title: "Protein Target",
      description: "Hit daily protein goals for 6 days",
      type: "nutrition",
    },
    {
      week: 4,
      title: "Progressive Overload",
      description: "Increase weights by 5-10%",
      type: "performance",
    },
    {
      week: 6,
      title: "Body Measurements",
      description: "Record arm, chest, leg measurements",
      type: "measurement",
    },
    {
      week: 8,
      title: "1kg Muscle Gain",
      description: "Gain 1kg of lean muscle mass",
      type: "measurement",
    },
    {
      week: 12,
      title: "15% Strength Increase",
      description: "Increase main lifts by 15%",
      type: "performance",
    },
    {
      week: 16,
      title: "Target Muscle Mass",
      description: "Achieve target muscle gain",
      type: "final",
    },
  ],
  army_military_prep: [
    {
      week: 1,
      title: "Fitness Baseline",
      description: "Complete initial fitness test",
      type: "assessment",
    },
    {
      week: 2,
      title: "20 Push-ups",
      description: "Complete 20 consecutive push-ups",
      type: "performance",
    },
    {
      week: 4,
      title: "1.5 Mile Run",
      description: "Run 1.5 miles under 15 minutes",
      type: "cardio",
    },
    {
      week: 6,
      title: "30 Push-ups",
      description: "Complete 30 consecutive push-ups",
      type: "performance",
    },
    {
      week: 8,
      title: "2 Mile Run",
      description: "Run 2 miles under 18 minutes",
      type: "cardio",
    },
    {
      week: 12,
      title: "40 Push-ups",
      description: "Complete 40 consecutive push-ups",
      type: "performance",
    },
    {
      week: 16,
      title: "Military Standards",
      description: "Meet all military fitness requirements",
      type: "final",
    },
    {
      week: 20,
      title: "Test Ready",
      description: "Pass complete military fitness test",
      type: "final",
    },
  ],
  marathon_running: [
    {
      week: 1,
      title: "Base Miles",
      description: "Run 15 miles total this week",
      type: "volume",
    },
    {
      week: 4,
      title: "5K Time Trial",
      description: "Complete 5K under target pace",
      type: "performance",
    },
    {
      week: 8,
      title: "10K Race",
      description: "Complete 10K race or time trial",
      type: "race",
    },
    {
      week: 12,
      title: "Half Marathon",
      description: "Complete half marathon distance",
      type: "race",
    },
    {
      week: 16,
      title: "20 Mile Run",
      description: "Complete 20-mile long run",
      type: "endurance",
    },
    {
      week: 20,
      title: "Peak Week",
      description: "Complete highest mileage week",
      type: "volume",
    },
    {
      week: 24,
      title: "Marathon Ready",
      description: "Complete full marathon",
      type: "final",
    },
  ],
};

const achievementTypes = [
  {
    id: "first_milestone",
    title: "First Steps",
    description: "Complete your first milestone",
    icon: "🎯",
    color: "bg-blue-500",
    points: 50,
  },
  {
    id: "week_completed",
    title: "Weekly Warrior",
    description: "Complete all milestones in a week",
    icon: "⚡",
    color: "bg-yellow-500",
    points: 100,
  },
  {
    id: "streak_7",
    title: "Week Streak",
    description: "Complete milestones 7 days in a row",
    icon: "🔥",
    color: "bg-orange-500",
    points: 150,
  },
  {
    id: "halfway_hero",
    title: "Halfway Hero",
    description: "Complete 50% of your milestones",
    icon: "🏆",
    color: "bg-purple-500",
    points: 200,
  },
  {
    id: "milestone_master",
    title: "Milestone Master",
    description: "Complete 100% of your milestones",
    icon: "👑",
    color: "bg-gold-500",
    points: 500,
  },
];

const MilestonesManager: React.FC<MilestonesManagerProps> = ({
  goalId,
  goal,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [editingMilestoneData, setEditingMilestoneData] =
    useState<Milestone | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [generatingMilestones, setGeneratingMilestones] = useState(false);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("milestones_active_section")
        : null;
    if (saved) setActiveSection(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("milestones_active_section", activeSection);
    }
  }, [activeSection]);

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

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    milestone_type: "weekly" as "weekly" | "daily" | "custom",
    week_number: 1,
    day_number: 1,
    target_value: "",
    unit: "",
    due_date: "",
    is_mandatory: true,
  });

  useEffect(() => {
    if (goalId) {
      loadMilestones();
      loadAchievements();
    }
  }, [goalId]);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("goal_milestones")
        .select("*")
        .eq("goal_id", goalId)
        .order("week_number", { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error("Error loading milestones:", error);
      toast({
        title: "Error",
        description: "Failed to load milestones. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from("goal_achievements")
        .select("*")
        .eq("goal_id", goalId)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  const generateMilestones = async () => {
    if (generatingMilestones) return; // Prevent spam clicking
    try {
      setGeneratingMilestones(true);
      const templates =
        milestoneTemplates[goal.goal_type as keyof typeof milestoneTemplates];
      if (!templates) {
        toast({
          title: "No Templates",
          description: "No milestone templates available for this goal type.",
          variant: "destructive",
        });
        return;
      }

      const startDate = new Date(goal.start_date);
      const existingWeeklyWeeks = milestones
        .filter(
          (m) =>
            m.milestone_type === "weekly" && typeof m.week_number === "number"
        )
        .map((m) => m.week_number as number);
      const currentMaxWeek = existingWeeklyWeeks.length
        ? Math.max(...existingWeeklyWeeks)
        : 0;

      const milestonesToCreate = templates.map((template) => {
        const weekNumber = currentMaxWeek + template.week;
        return {
          goal_id: goalId,
          title: template.title,
          description: template.description,
          milestone_type: "weekly" as const,
          week_number: weekNumber,
          status: "pending" as const,
          due_date: new Date(
            startDate.getTime() + weekNumber * 7 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          is_mandatory: template.type === "final",
        };
      });

      const { data, error } = await supabase
        .from("goal_milestones")
        .insert(milestonesToCreate)
        .select();

      if (error) throw error;

      setMilestones([...milestones, ...data]);
      toast({
        title: "Success!",
        description: `Generated ${data.length} milestones for your goal.`,
      });
    } catch (error) {
      console.error("Error generating milestones:", error);
      toast({
        title: "Error",
        description: "Failed to generate milestones. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingMilestones(false);
    }
  };

  const addMilestone = async () => {
    try {
      if (!newMilestone.title || !newMilestone.description) {
        toast({
          title: "Missing Information",
          description: "Please enter title and description.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("goal_milestones")
        .insert([
          {
            goal_id: goalId,
            title: newMilestone.title,
            description: newMilestone.description,
            milestone_type: newMilestone.milestone_type,
            week_number:
              newMilestone.milestone_type === "weekly"
                ? newMilestone.week_number
                : null,
            day_number:
              newMilestone.milestone_type === "daily"
                ? newMilestone.day_number
                : null,
            target_value: newMilestone.target_value
              ? parseFloat(newMilestone.target_value)
              : null,
            unit: newMilestone.unit || null,
            due_date: newMilestone.due_date || null,
            is_mandatory: newMilestone.is_mandatory,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setMilestones([...milestones, data]);
      setShowAddMilestone(false);
      setNewMilestone({
        title: "",
        description: "",
        milestone_type: "weekly",
        week_number: 1,
        day_number: 1,
        target_value: "",
        unit: "",
        due_date: "",
        is_mandatory: true,
      });

      toast({
        title: "Success!",
        description: "Milestone added successfully.",
      });
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast({
        title: "Error",
        description: "Failed to add milestone. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateMilestoneStatus = async (
    milestoneId: string,
    status: "completed" | "skipped" | "in_progress",
    achievedValue?: number,
    notes?: string
  ) => {
    const previous = milestones.find((m) => m.id === milestoneId);
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId ? ({ ...m, status } as any) : m
      )
    );
    try {
      const updates: any = {
        status,
        achieved_at: status === "completed" ? new Date().toISOString() : null,
        achieved_value: achievedValue || null,
        notes: notes || null,
      };

      const { data, error } = await supabase
        .from("goal_milestones")
        .update(updates)
        .eq("id", milestoneId)
        .select()
        .single();

      if (error) throw error;

      setMilestones(milestones.map((m) => (m.id === milestoneId ? data : m)));

      // Check for achievements
      if (status === "completed") {
        await checkAchievements();
      }

      toast({
        title:
          status === "completed" ? "Milestone Completed!" : "Milestone Updated",
        description:
          status === "completed"
            ? "Great job! Keep up the momentum."
            : "Milestone status updated.",
      });
    } catch (error) {
      console.error("Error updating milestone:", error);
      // rollback UI
      if (previous) {
        setMilestones(
          milestones.map((m) => (m.id === milestoneId ? previous : m))
        );
      }
      toast({
        title: "Error",
        description: "Failed to update milestone. Please try again.",
        variant: "destructive",
      });
    }
  };

  const checkAchievements = async () => {
    try {
      const completedMilestones = milestones.filter(
        (m) => m.status === "completed"
      );
      const totalMilestones = milestones.length;
      const completionRate =
        totalMilestones > 0
          ? (completedMilestones.length / totalMilestones) * 100
          : 0;

      // Check for new achievements
      const newAchievements = [];

      // First milestone achievement
      if (
        completedMilestones.length === 1 &&
        !achievements.find((a) => a.achievement_type === "first_milestone")
      ) {
        newAchievements.push({
          user_id: user?.id,
          goal_id: goalId,
          title: "First Steps",
          description: "Completed your first milestone",
          achievement_type: "first_milestone",
          points_awarded: 50,
          badge_icon: "🎯",
          badge_color: "blue",
          is_rare: false,
          difficulty_level: 1,
        });
      }

      // Halfway achievement
      if (
        completionRate >= 50 &&
        !achievements.find((a) => a.achievement_type === "halfway_hero")
      ) {
        newAchievements.push({
          user_id: user?.id,
          goal_id: goalId,
          title: "Halfway Hero",
          description: "Completed 50% of your milestones",
          achievement_type: "halfway_hero",
          points_awarded: 200,
          badge_icon: "🏆",
          badge_color: "purple",
          is_rare: false,
          difficulty_level: 3,
        });
      }

      // Milestone master achievement
      if (
        completionRate === 100 &&
        !achievements.find((a) => a.achievement_type === "milestone_master")
      ) {
        newAchievements.push({
          user_id: user?.id,
          goal_id: goalId,
          title: "Milestone Master",
          description: "Completed 100% of your milestones",
          achievement_type: "milestone_master",
          points_awarded: 500,
          badge_icon: "👑",
          badge_color: "gold",
          is_rare: true,
          difficulty_level: 5,
        });
      }

      if (newAchievements.length > 0) {
        const { data, error } = await supabase
          .from("goal_achievements")
          .insert(newAchievements)
          .select();

        if (error) throw error;
        setAchievements([...data, ...achievements]);

        // Show achievement notification
        newAchievements.forEach((achievement) => {
          toast({
            title: `🏆 Achievement Unlocked!`,
            description: `${achievement.title}: ${achievement.description}`,
          });
        });
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  };

  const deleteMilestone = async (milestoneId: string) => {
    try {
      const { error } = await supabase
        .from("goal_milestones")
        .delete()
        .eq("id", milestoneId);

      if (error) throw error;

      setMilestones(milestones.filter((m) => m.id !== milestoneId));
      toast({
        title: "Deleted",
        description: "Milestone deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast({
        title: "Error",
        description: "Failed to delete milestone.",
        variant: "destructive",
      });
    }
  };

  const toggleWeekExpansion = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  const OverviewTab = () => {
    const completedMilestones = milestones.filter(
      (m) => m.status === "completed"
    );
    const pendingMilestones = milestones.filter((m) => m.status === "pending");
    const inProgressMilestones = milestones.filter(
      (m) => m.status === "in_progress"
    );
    const overdueMilestones = milestones.filter(
      (m) =>
        m.status === "pending" &&
        m.due_date &&
        new Date(m.due_date) < new Date()
    );

    const completionRate =
      milestones.length > 0
        ? (completedMilestones.length / milestones.length) * 100
        : 0;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Milestones
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{milestones.length}</div>
              <p className="text-xs text-muted-foreground">created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedMilestones.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(completionRate)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inProgressMilestones.length}
              </div>
              <p className="text-xs text-muted-foreground">active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {overdueMilestones.length}
              </div>
              <p className="text-xs text-muted-foreground">need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Progress Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Overall Completion
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(completionRate)}%
                  </span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {completedMilestones.length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {inProgressMilestones.length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {pendingMilestones.length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => setShowAddMilestone(true)}
                className="flex items-center space-x-2 "
              >
                <Plus className="h-4 w-4" />
                <span>Add Milestone</span>
              </Button>

              <Button
                variant="outline"
                onClick={generateMilestones}
                disabled={generatingMilestones}
                className="flex items-center space-x-2"
              >
                {generatingMilestones ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span>
                  {generatingMilestones
                    ? "Generating..."
                    : "Generate Milestones"}
                </span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center space-x-2"
                onClick={() => setActiveSection("achievements")}
              >
                <Trophy className="h-4 w-4" />
                <span>View Achievements</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Milestones */}
        {milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Recent Milestones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {milestones.slice(0, 4).map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newStatus =
                            milestone.status === "completed"
                              ? "pending"
                              : "completed";
                          updateMilestoneStatus(
                            milestone.id,
                            newStatus as "completed" | "skipped" | "in_progress"
                          );
                        }}
                        className="shrink-0"
                      >
                        {milestone.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base line-clamp-1">
                          {milestone.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "default"
                          : milestone.status === "in_progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs self-start sm:self-center shrink-0"
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Recent Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    <div className="text-2xl">{achievement.badge_icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      +{achievement.points_awarded} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const WeeklyTab = () => {
    const weeklyMilestones = milestones.filter(
      (m) => m.milestone_type === "weekly"
    );
    const milestonesByWeek = weeklyMilestones.reduce((acc, milestone) => {
      const week = milestone.week_number || 0;
      if (!acc[week]) acc[week] = [];
      acc[week].push(milestone);
      return acc;
    }, {} as Record<number, Milestone[]>);

    const weeks = Object.keys(milestonesByWeek)
      .map(Number)
      .sort((a, b) => a - b);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Weekly Milestones</h3>
        </div>

        {weeks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium mb-2">No Weekly Milestones</h4>
              <p className="text-gray-600 mb-4">
                Create milestones to track your weekly progress
              </p>
              <Button onClick={() => setShowAddMilestone(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Milestone
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {weeks.map((weekNumber) => {
              const weekMilestones = milestonesByWeek[weekNumber];
              const completedCount = weekMilestones.filter(
                (m) => m.status === "completed"
              ).length;
              const totalCount = weekMilestones.length;
              const completionRate =
                totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
              const isExpanded = expandedWeeks.has(weekNumber);

              return (
                <Card
                  key={weekNumber}
                  className="hover:shadow-md transition-shadow"
                >
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={() => toggleWeekExpansion(weekNumber)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <div>
                              <CardTitle className="text-lg">
                                Week {weekNumber}
                              </CardTitle>
                              <CardDescription>
                                {completedCount} of {totalCount} milestones
                                completed
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant={
                                completionRate === 100
                                  ? "default"
                                  : completionRate > 0
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {Math.round(completionRate)}%
                            </Badge>
                            <Progress
                              value={completionRate}
                              className="w-20 h-2"
                            />
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-3 min-h-[1px]">
                          {weekMilestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className={`flex items-center space-x-3 p-3 border rounded-lg ${
                                milestone.status === "completed"
                                  ? "border-green-200"
                                  : milestone.status === "in_progress"
                                  ? "border-blue-200"
                                  : "border-border"
                              }`}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newStatus =
                                    milestone.status === "completed"
                                      ? "pending"
                                      : "completed";
                                  updateMilestoneStatus(
                                    milestone.id,
                                    newStatus as
                                      | "completed"
                                      | "skipped"
                                      | "in_progress"
                                  );
                                }}
                              >
                                {milestone.status === "completed" ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-400" />
                                )}
                              </Button>

                              <div className="flex-1">
                                <h4 className="font-medium">
                                  {milestone.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {milestone.description}
                                </p>

                                {milestone.target_value && (
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Target className="h-3 w-3 text-blue-500" />
                                    <span className="text-xs text-blue-600">
                                      Target: {milestone.target_value}{" "}
                                      {milestone.unit}
                                    </span>
                                  </div>
                                )}

                                {milestone.due_date && (
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-600">
                                      Due:{" "}
                                      {new Date(
                                        milestone.due_date
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    milestone.status === "completed"
                                      ? "default"
                                      : milestone.status === "in_progress"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {milestone.status}
                                </Badge>

                                {milestone.status === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateMilestoneStatus(
                                        milestone.id,
                                        "in_progress"
                                      );
                                    }}
                                  >
                                    Start
                                  </Button>
                                )}

                                {milestone.status === "in_progress" && (
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateMilestoneStatus(
                                          milestone.id,
                                          "completed"
                                        );
                                      }}
                                    >
                                      Done
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateMilestoneStatus(
                                          milestone.id,
                                          "skipped"
                                        );
                                      }}
                                    >
                                      <SkipForward className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingMilestone(milestone.id);
                                    setEditingMilestoneData(milestone);
                                  }}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMilestone(milestone.id);
                                  }}
                                  className="wellness-gradient"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const AchievementsTab = () => (
    <div className="space-y-6">
      {achievements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-medium mb-2">No Achievements Yet</h4>
            <p className="text-gray-600 mb-4">
              Complete milestones to unlock achievements
            </p>
            <Button onClick={() => setActiveSection("weekly")}>
              <Target className="h-4 w-4 mr-2" />
              View Milestones
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{achievement.badge_icon}</div>
                <h4 className="font-bold text-lg mb-2">{achievement.title}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {achievement.description}
                </p>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    +{achievement.points_awarded} pts
                  </Badge>
                  {achievement.is_rare && (
                    <Badge variant="outline">🌟 Rare</Badge>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Earned {new Date(achievement.earned_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Available Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5" />
            <span>Available Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievementTypes.map((achievement) => {
              const isEarned = achievements.find(
                (a) => a.achievement_type === achievement.id
              );
              return (
                <div
                  key={achievement.id}
                  className={`p-4 border rounded-lg ${
                    isEarned ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={isEarned ? "default" : "outline"}>
                        {isEarned ? "Earned" : `${achievement.points} pts`}
                      </Badge>
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewTab />;
      case "weekly":
        return <WeeklyTab />;
      case "achievements":
        return <AchievementsTab />;
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
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span>Milestones</span>
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Track milestones & earn rewards
          </p>
        </div>

        <Button
          onClick={() => setShowAddMilestone(true)}
          className="wellness-gradient flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Milestone</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <NavigationCard
          id="overview"
          title="Overview"
          description="Progress summary & stats"
          icon={BarChart3}
          count={milestones.length}
          isActive={activeSection === "overview"}
          onClick={() => setActiveSection("overview")}
        />

        <NavigationCard
          id="weekly"
          title="Weekly"
          description="Weekly milestone tracking"
          icon={Activity}
          count={milestones.filter((m) => m.milestone_type === "weekly").length}
          isActive={activeSection === "weekly"}
          onClick={() => setActiveSection("weekly")}
        />

        <NavigationCard
          id="achievements"
          title="Achievements"
          description="Earned rewards & badges"
          icon={Trophy}
          count={achievements.length}
          isActive={activeSection === "achievements"}
          onClick={() => setActiveSection("achievements")}
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

      {/* Add Milestone Dialog */}
      <Dialog open={showAddMilestone} onOpenChange={setShowAddMilestone}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Milestone</DialogTitle>
            <DialogDescription>
              Create a milestone to track specific achievements in your goal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newMilestone.title}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, title: e.target.value })
                  }
                  placeholder="e.g., Complete 20 push-ups"
                />
              </div>

              <div>
                <Label htmlFor="milestone_type">Type</Label>
                <Select
                  value={newMilestone.milestone_type}
                  onValueChange={(value) =>
                    setNewMilestone({
                      ...newMilestone,
                      milestone_type: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select milestone type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly Milestone</SelectItem>
                    <SelectItem value="daily">Daily Task</SelectItem>
                    <SelectItem value="custom">Custom Timeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    description: e.target.value,
                  })
                }
                placeholder="Describe what needs to be accomplished..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newMilestone.milestone_type === "weekly" && (
                <div>
                  <Label htmlFor="week_number">Week Number</Label>
                  <Input
                    id="week_number"
                    type="number"
                    min="1"
                    value={newMilestone.week_number}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        week_number: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              )}

              {newMilestone.milestone_type === "daily" && (
                <div>
                  <Label htmlFor="day_number">Day Number</Label>
                  <Input
                    id="day_number"
                    type="number"
                    min="1"
                    value={newMilestone.day_number}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        day_number: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              )}

              <div>
                <Label htmlFor="target_value">Target Value (optional)</Label>
                <Input
                  id="target_value"
                  type="number"
                  step="0.1"
                  value={newMilestone.target_value}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      target_value: e.target.value,
                    })
                  }
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit (optional)</Label>
                <Input
                  id="unit"
                  value={newMilestone.unit}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, unit: e.target.value })
                  }
                  placeholder="e.g., reps, kg, minutes"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="due_date">Due Date (optional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newMilestone.due_date}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      due_date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_mandatory"
                  checked={newMilestone.is_mandatory}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      is_mandatory: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="is_mandatory">Mandatory milestone</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAddMilestone(false)}
                className="wellness-gradient"
              >
                Cancel
              </Button>
              <Button onClick={addMilestone} className="wellness-gradient">
                <Save className="h-4 w-4 mr-2" />
                Create Milestone
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MilestonesManager;
