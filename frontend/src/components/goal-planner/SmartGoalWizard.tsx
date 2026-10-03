import React, { useState, useCallback } from "react";

import {
  Target,
  ArrowRight,
  ChevronLeft,
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  Dumbbell,
  Heart,
  Brain,
  Star,
  Plus,
  TrendingUp,
  Medal,
  Timer,
  Zap,
  Trophy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { goalTypes, GoalType } from "@/data/goalTypes";

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
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export interface GoalFormData {
  // Basic Info
  title: string;
  description: string;
  goal_type: string;
  priority: "low" | "medium" | "high" | "critical";

  // Timeline
  start_date: string;
  target_date: string;
  estimated_duration_weeks: number;

  // Physical Metrics
  current_weight?: number;
  target_weight?: number;
  current_body_fat?: number;
  target_body_fat?: number;
  current_muscle_mass?: number;
  target_muscle_mass?: number;

  // Personal Details
  age?: number;
  gender?: "male" | "female" | "other";
  fitness_level: "beginner" | "intermediate" | "advanced";
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";

  // Preferences
  preferred_workout_days: string[];
  available_time_per_day: number; // minutes
  equipment_available: string[];
  dietary_restrictions: string[];
  health_conditions: string[];

  // Motivation
  why_this_goal: string;
  previous_attempts: boolean;
  support_system: string[];

  // Custom Targets
  custom_targets: Record<string, any>;

  // Military/Strength specific
  current_pushups?: number;
  current_situps?: number;
  current_runtime?: number;
  current_5k_time?: number;
  target_marathon_time?: number;
  current_squat?: number;
  current_bench?: number;
  current_deadlift?: number;

  // Flexibility/Mental/Rehab specific
  current_flexibility?: string;
  target_flexibility?: string;
  current_stress_level?: string;
  target_mental_state?: string;
  injury_type?: string;
  recovery_stage?: string;
  transformation_goal?: string;
  custom_goal_description?: string;
  custom_metrics?: string;
  custom_timeline?: string;

  // Preferences
  workout_environment?: string;
  available_equipment?: string[];
  intensity_preference?: string;
  training_style_preferences?: string[];

  // Motivation
  primary_motivation?: string;
  motivational_quote?: string;
  notification_preferences?: string[];

  // File upload
  current_photo?: File;

  // Date Range
  date_range?: DateRange;
}

interface SmartGoalWizardProps {
  onComplete: (goalData: GoalFormData) => void;
  onClose: () => void;
}

const SmartGoalWizard: React.FC<SmartGoalWizardProps> = ({
  onComplete,
  onClose,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoalType, setSelectedGoalType] = useState<GoalType | null>(
    null
  );
  const [formData, setFormData] = useState<GoalFormData>({
    title: "",
    description: "",
    goal_type: "",
    priority: "medium",
    start_date: new Date().toISOString().split("T")[0],
    target_date: "",
    estimated_duration_weeks: 12,
    fitness_level: "beginner",
    activity_level: "moderately_active",
    preferred_workout_days: [],
    available_time_per_day: 60,
    date_range: { from: new Date(), to: undefined } as DateRange,
    equipment_available: [],
    dietary_restrictions: [],
    health_conditions: [],
    why_this_goal: "",
    previous_attempts: false,
    support_system: [],
    custom_targets: {},
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const supportOptions = [
    "Family",
    "Friends",
    "Workout partner",
    "Personal trainer",
    "Online community",
    "Health coach",
    "Nutritionist",
    "Going solo",
  ];

  const updateFormData = (updates: Partial<GoalFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Validation functions for each step
  const isStep1Valid = () => {
    return selectedGoalType !== null;
  };

  const isStep2Valid = () => {
    return (
      formData.age &&
      formData.age >= 13 &&
      formData.age <= 100 &&
      formData.gender &&
      formData.fitness_level &&
      formData.activity_level &&
      formData.available_time_per_day > 0
    );
  };

  const isStep3Valid = () => {
    // Step 3 is optional for non-weight related goals
    if (!selectedGoalType) return true;

    const weightRelatedGoals = [
      "fat_loss",
      "muscle_gain",
      "lean_body",
      "body_transformation",
    ];
    if (!weightRelatedGoals.includes(selectedGoalType.id)) {
      return true;
    }

    return (
      formData.current_weight &&
      formData.current_weight > 0 &&
      formData.target_weight &&
      formData.target_weight > 0
    );
  };

  const isStep4Valid = () => {
    return (
      formData.preferred_workout_days.length > 0 &&
      formData.equipment_available.length > 0
    );
  };

  const isStep5Valid = () => {
    return (
      formData.why_this_goal.trim().length > 0 &&
      formData.support_system.length > 0
    );
  };

  const isStep6Valid = () => {
    return (
      formData.title.trim().length > 0 &&
      formData.start_date &&
      formData.target_date &&
      formData.priority
    );
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      case 5:
        return isStep5Valid();
      case 6:
        return isStep6Valid();
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const selectGoalType = (goalType: GoalType) => {
    setSelectedGoalType(goalType);
    updateFormData({
      goal_type: goalType.id,
      title: goalType.name,
      description: goalType.description,
      estimated_duration_weeks: goalType.estimatedWeeks,
      target_date: new Date(
        Date.now() + goalType.estimatedWeeks * 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
    });
    nextStep();
  };

  const handleComplete = () => {
    // Validate required fields
    if (!formData.goal_type || !formData.title || !formData.target_date) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields.",
        variant: "destructive",
      });
      return;
    }

    onComplete(formData);
  };

  // Step 1: Goal Type Selection
  const StepGoalType = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto px-2 py-1">
        {goalTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <Card
              key={type.id}
              className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-blue-300"
              onClick={() => selectGoalType(type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${type.color}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm truncate">
                      {type.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {type.estimatedWeeks} weeks
                      </Badge>
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
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {type.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">
                    {type.successRate}% success rate
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Step 4: Equipment & Restrictions
  const StepEquipmentRestrictions = () => {
    const equipmentOptions = [
      "Home gym",
      "Commercial gym",
      "Dumbbells",
      "Barbell",
      "Resistance bands",
      "Pull-up bar",
      "Kettlebells",
      "Cardio machines",
      "Yoga mat",
      "No equipment",
    ];

    const dietaryOptions = [
      "Vegetarian",
      "Vegan",
      "Keto",
      "Paleo",
      "Gluten-free",
      "Dairy-free",
      "Nut allergies",
      "Low-carb",
      "Mediterranean",
      "None",
    ];

    const healthOptions = [
      "Knee issues",
      "Back problems",
      "Heart condition",
      "Diabetes",
      "High blood pressure",
      "Arthritis",
      "Previous injuries",
      "None",
    ];

    return (
      <div className="space-y-6">
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Available Equipment</Label>
            <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {equipmentOptions.map((equipment) => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox
                    id={equipment}
                    checked={formData.equipment_available.includes(equipment)}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...formData.equipment_available, equipment]
                        : formData.equipment_available.filter(
                            (e) => e !== equipment
                          );
                      updateFormData({ equipment_available: updated });
                    }}
                  />
                  <Label htmlFor={equipment} className="text-sm">
                    {equipment}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">
              Dietary Restrictions
            </Label>
            <p className="text-sm text-gray-600 mb-3">Select any that apply</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietaryOptions.map((diet) => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox
                    id={diet}
                    checked={formData.dietary_restrictions.includes(diet)}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...formData.dietary_restrictions, diet]
                        : formData.dietary_restrictions.filter(
                            (d) => d !== diet
                          );
                      updateFormData({ dietary_restrictions: updated });
                    }}
                  />
                  <Label htmlFor={diet} className="text-sm">
                    {diet}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Health Conditions</Label>
            <p className="text-sm text-gray-600 mb-3">
              Select any that apply (consult your doctor before starting)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {healthOptions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={formData.health_conditions.includes(condition)}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...formData.health_conditions, condition]
                        : formData.health_conditions.filter(
                            (h) => h !== condition
                          );
                      updateFormData({ health_conditions: updated });
                    }}
                  />
                  <Label htmlFor={condition} className="text-sm">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 6: Timeline & Finalization
  const StepTimelineFinalization = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="Give your goal a motivating title"
            />
          </div>

          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => updateFormData({ start_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="target_date">Target Date</Label>
            <Input
              id="target_date"
              type="date"
              value={formData.target_date}
              onChange={(e) => updateFormData({ target_date: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Estimated Duration</Label>
            <div className="px-2">
              <Slider
                value={[formData.estimated_duration_weeks]}
                onValueChange={(value) => {
                  const weeks = value[0];
                  updateFormData({
                    estimated_duration_weeks: weeks,
                    target_date: new Date(
                      Date.now() + weeks * 7 * 24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0],
                  });
                }}
                max={52}
                min={4}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>4 weeks</span>
                <span className="font-medium">
                  {formData.estimated_duration_weeks} weeks
                </span>
                <span>1 year</span>
              </div>
            </div>
          </div>

          <Card className="p-4">
            <h4 className="font-medium mb-2">AI Recommendations</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>
                  Optimal duration: {selectedGoalType?.estimatedWeeks} weeks
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Success rate: {selectedGoalType?.successRate}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span>Community support available</span>
              </div>
            </div>
          </Card>

          <div>
            <Label htmlFor="description">Additional Notes</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Any additional details about your goal..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepGoalType />;
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
              <div className="space-y-5">
                <div>
                  <Label htmlFor="age" className="mb-3 block">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="13"
                    max="100"
                    value={formData.age || ""}
                    onChange={(e) =>
                      updateFormData({
                        age: parseInt(e.target.value) || undefined,
                      })
                    }
                    onBlur={() => {
                      if (formData.age) {
                        const clamped = Math.min(
                          100,
                          Math.max(13, formData.age)
                        );
                        if (clamped !== formData.age)
                          updateFormData({ age: clamped });
                      }
                    }}
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Gender</Label>
                  <RadioGroup
                    value={formData.gender || ""}
                    onValueChange={(value) =>
                      updateFormData({ gender: value as any })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="mb-3 block">Current Fitness Level</Label>
                  <Select
                    value={formData.fitness_level}
                    onValueChange={(value) =>
                      updateFormData({ fitness_level: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your fitness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">
                        Beginner (New to exercise)
                      </SelectItem>
                      <SelectItem value="intermediate">
                        Intermediate (Regular exercise)
                      </SelectItem>
                      <SelectItem value="advanced">
                        Advanced (Experienced athlete)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">Activity Level</Label>
                  <Select
                    value={formData.activity_level}
                    onValueChange={(value) =>
                      updateFormData({ activity_level: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">
                        Sedentary (Desk job, minimal exercise)
                      </SelectItem>
                      <SelectItem value="lightly_active">
                        Lightly Active (Light exercise 1-3 days/week)
                      </SelectItem>
                      <SelectItem value="moderately_active">
                        Moderately Active (Moderate exercise 3-5 days/week)
                      </SelectItem>
                      <SelectItem value="very_active">
                        Very Active (Hard exercise 6-7 days/week)
                      </SelectItem>
                      <SelectItem value="extremely_active">
                        Extremely Active (Physical job + exercise)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Available Time Per Day</Label>
                  <div className="space-y-4">
                    <div className="px-2">
                      <Slider
                        value={[formData.available_time_per_day]}
                        onValueChange={(value) =>
                          updateFormData({ available_time_per_day: value[0] })
                        }
                        max={180}
                        min={15}
                        step={15}
                        className="w-full"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        {formData.available_time_per_day} minutes
                      </div>
                      <div className="text-sm text-gray-600">
                        {formData.available_time_per_day <= 30 &&
                          "⚡ Quick workout sessions"}
                        {formData.available_time_per_day > 30 &&
                          formData.available_time_per_day <= 60 &&
                          "💪 Standard workout time"}
                        {formData.available_time_per_day > 60 &&
                          "🏋️ Extended training sessions"}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Preferred Workout Days</Label>
                  <div className="grid grid-cols-7 gap-2 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <Button
                          key={day}
                          variant={
                            formData.preferred_workout_days.includes(day)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            const days =
                              formData.preferred_workout_days.includes(day)
                                ? formData.preferred_workout_days.filter(
                                    (d) => d !== day
                                  )
                                : [...formData.preferred_workout_days, day];
                            updateFormData({ preferred_workout_days: days });
                          }}
                        >
                          {day}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="">
              {(selectedGoalType?.id === "fat_loss" ||
                selectedGoalType?.id === "muscle_gain" ||
                selectedGoalType?.id === "lean_body" ||
                selectedGoalType?.id === "body_transformation") && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">
                      Current Measurements
                    </h4>

                    <div>
                      <Label htmlFor="current_weight" className="mb-2.5 block">
                        Current Weight (kg)
                      </Label>
                      <Input
                        id="current_weight"
                        type="number"
                        step="0.1"
                        value={formData.current_weight || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_weight:
                              parseFloat(e.target.value) || undefined,
                          })
                        }
                        onBlur={() => {
                          if (formData.current_weight) {
                            const clamped = Math.min(
                              400,
                              Math.max(20, formData.current_weight)
                            );
                            if (clamped !== formData.current_weight)
                              updateFormData({ current_weight: clamped });
                          }
                        }}
                        placeholder="Enter your current weight"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="current_body_fat"
                        className="mb-2.5 block"
                      >
                        Current Body Fat % (optional)
                      </Label>
                      <Input
                        id="current_body_fat"
                        type="number"
                        step="0.1"
                        value={formData.current_body_fat || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_body_fat:
                              parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="Enter current body fat percentage"
                      />
                    </div>

                    {selectedGoalType?.id === "muscle_gain" && (
                      <div>
                        <Label
                          htmlFor="current_muscle_mass"
                          className="mb-2.5 block"
                        >
                          Current Muscle Mass (kg) (optional)
                        </Label>
                        <Input
                          id="current_muscle_mass"
                          type="number"
                          step="0.1"
                          value={formData.current_muscle_mass || ""}
                          onChange={(e) =>
                            updateFormData({
                              current_muscle_mass:
                                parseFloat(e.target.value) || undefined,
                            })
                          }
                          placeholder="Enter current muscle mass"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Target Goals</h4>

                    <div>
                      <Label htmlFor="target_weight" className="mb-2.5 block">
                        Target Weight (kg)
                      </Label>
                      <Input
                        id="target_weight"
                        type="number"
                        step="0.1"
                        value={formData.target_weight || ""}
                        onChange={(e) =>
                          updateFormData({
                            target_weight:
                              parseFloat(e.target.value) || undefined,
                          })
                        }
                        onBlur={() => {
                          if (formData.target_weight) {
                            const clamped = Math.min(
                              400,
                              Math.max(20, formData.target_weight)
                            );
                            if (clamped !== formData.target_weight)
                              updateFormData({ target_weight: clamped });
                          }
                        }}
                        placeholder="Enter your target weight"
                      />
                    </div>

                    <div>
                      <Label htmlFor="target_body_fat" className="mb-2.5 block">
                        Target Body Fat % (optional)
                      </Label>
                      <Input
                        id="target_body_fat"
                        type="number"
                        step="0.1"
                        value={formData.target_body_fat || ""}
                        onChange={(e) =>
                          updateFormData({
                            target_body_fat:
                              parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="Enter target body fat percentage"
                      />
                    </div>

                    {selectedGoalType?.id === "muscle_gain" && (
                      <div>
                        <Label
                          htmlFor="target_muscle_mass"
                          className="mb-2.5 block"
                        >
                          Target Muscle Mass (kg) (optional)
                        </Label>
                        <Input
                          id="target_muscle_mass"
                          type="number"
                          step="0.1"
                          value={formData.target_muscle_mass || ""}
                          onChange={(e) =>
                            updateFormData({
                              target_muscle_mass:
                                parseFloat(e.target.value) || undefined,
                            })
                          }
                          placeholder="Enter target muscle mass"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedGoalType?.id === "six_pack_abs" && (
                <div className="col-span-2 space-y-4">
                  <h4 className="font-medium text-lg">
                    Core & Abdominal Goals
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="current_body_fat_abs"
                        className="mb-2.5 block"
                      >
                        Current Body Fat % (required for visible abs)
                      </Label>
                      <Input
                        id="current_body_fat_abs"
                        type="number"
                        step="0.1"
                        value={formData.current_body_fat || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_body_fat:
                              parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="Enter current body fat percentage"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Visible abs typically require body fat below 15% for
                        men, 20% for women
                      </p>
                    </div>
                    <div>
                      <Label
                        htmlFor="target_body_fat_abs"
                        className="mb-2.5 block"
                      >
                        Target Body Fat % for Visible Abs
                      </Label>
                      <Input
                        id="target_body_fat_abs"
                        type="number"
                        step="0.1"
                        value={formData.target_body_fat || ""}
                        onChange={(e) =>
                          updateFormData({
                            target_body_fat:
                              parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="Target body fat percentage"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedGoalType?.id === "army_military_prep" && (
                <div className="col-span-2 space-y-4">
                  <h4 className="font-medium text-lg">
                    Military Fitness Standards
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="current_pushups" className="mb-2.5 block">
                        Current Push-ups (in 2 min)
                      </Label>
                      <Input
                        id="current_pushups"
                        type="number"
                        value={formData.current_pushups || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_pushups:
                              parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="Number of push-ups"
                      />
                    </div>
                    <div>
                      <Label htmlFor="current_situps" className="mb-2.5 block">
                        Current Sit-ups (in 2 min)
                      </Label>
                      <Input
                        id="current_situps"
                        type="number"
                        value={formData.current_situps || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_situps:
                              parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="Number of sit-ups"
                      />
                    </div>
                    <div>
                      <Label htmlFor="current_runtime" className="mb-2.5 block">
                        Current 2-Mile Run Time (minutes)
                      </Label>
                      <Input
                        id="current_runtime"
                        type="number"
                        step="0.1"
                        value={formData.current_runtime || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_runtime:
                              parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="Run time in minutes"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedGoalType?.id === "marathon_running" && (
                <div className="col-span-2 space-y-4">
                  <h4 className="font-medium text-lg">Running Goals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current_5k_time" className="mb-2.5 block">
                        Current 5K Time (minutes)
                      </Label>
                      <Input
                        id="current_5k_time"
                        type="number"
                        step="0.1"
                        value={formData.current_5k_time || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_5k_time:
                              parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="5K time in minutes"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="target_marathon_time"
                        className="mb-2.5 block"
                      >
                        Target Marathon Time (hours)
                      </Label>
                      <Input
                        id="target_marathon_time"
                        type="number"
                        step="0.1"
                        value={formData.target_marathon_time || ""}
                        onChange={(e) =>
                          updateFormData({
                            target_marathon_time:
                              parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="Marathon time in hours"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedGoalType?.id === "strength_powerlifting" && (
                <div className="col-span-2 space-y-4">
                  <h4 className="font-medium text-lg">Strength Goals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="current_squat" className="mb-2.5 block">
                        Current Squat 1RM (kg)
                      </Label>
                      <Input
                        id="current_squat"
                        type="number"
                        value={formData.current_squat || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_squat:
                              parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="Squat max weight"
                      />
                    </div>
                    <div>
                      <Label htmlFor="current_bench" className="mb-2.5 block">
                        Current Bench Press 1RM (kg)
                      </Label>
                      <Input
                        id="current_bench"
                        type="number"
                        value={formData.current_bench || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_bench:
                              parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="Bench press max weight"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="current_deadlift"
                        className="mb-2.5 block"
                      >
                        Current Deadlift 1RM (kg)
                      </Label>
                      <Input
                        id="current_deadlift"
                        type="number"
                        value={formData.current_deadlift || ""}
                        onChange={(e) =>
                          updateFormData({
                            current_deadlift:
                              parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="Deadlift max weight"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedGoalType?.id === "flexibility_mobility" && (
                <div className="col-span-2 space-y-4">
                  <h4 className="font-medium text-lg">
                    Flexibility Assessment
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="current_flexibility"
                        className="mb-2.5 block"
                      >
                        Current Flexibility Level
                      </Label>
                      <Select
                        value={formData.current_flexibility || ""}
                        onValueChange={(value) =>
                          updateFormData({ current_flexibility: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your flexibility level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poor">
                            Poor (Can't touch toes)
                          </SelectItem>
                          <SelectItem value="fair">
                            Fair (Can touch toes with effort)
                          </SelectItem>
                          <SelectItem value="good">
                            Good (Can touch toes easily)
                          </SelectItem>
                          <SelectItem value="excellent">
                            Excellent (Can palm the floor)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="target_flexibility"
                        className="mb-2.5 block"
                      >
                        Target Flexibility Goal
                      </Label>
                      <Select
                        value={formData.target_flexibility || ""}
                        onValueChange={(value) =>
                          updateFormData({ target_flexibility: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your target flexibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="improve_basic">
                            Improve basic flexibility
                          </SelectItem>
                          <SelectItem value="splits">Achieve splits</SelectItem>
                          <SelectItem value="advanced_mobility">
                            Advanced mobility
                          </SelectItem>
                          <SelectItem value="yoga_ready">
                            Yoga-ready flexibility
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {selectedGoalType?.id === "mental_wellness" && (
                <div className="col-span-2 space-y-4">
                  <h4 className="font-medium text-lg">Mental Wellness Goals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="current_stress_level"
                        className="mb-2.5 block"
                      >
                        Current Stress Level
                      </Label>
                      <Select
                        value={formData.current_stress_level || ""}
                        onValueChange={(value) =>
                          updateFormData({ current_stress_level: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your current stress level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            Low (Minimal stress)
                          </SelectItem>
                          <SelectItem value="moderate">
                            Moderate (Manageable stress)
                          </SelectItem>
                          <SelectItem value="high">
                            High (Significant stress)
                          </SelectItem>
                          <SelectItem value="severe">
                            Severe (Overwhelming stress)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="target_mental_state"
                        className="mb-2.5 block"
                      >
                        Target Mental State
                      </Label>
                      <Select
                        value={formData.target_mental_state || ""}
                        onValueChange={(value) =>
                          updateFormData({ target_mental_state: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your target mental state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="calm">Calm and relaxed</SelectItem>
                          <SelectItem value="focused">
                            Focused and productive
                          </SelectItem>
                          <SelectItem value="balanced">
                            Balanced and stable
                          </SelectItem>
                          <SelectItem value="energetic">
                            Energetic and positive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {selectedGoalType?.id === "rehabilitation" && (
                <div className="col-span-2 space-y-4">
                  <h4 className="font-medium text-lg">Rehabilitation Goals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="injury_type" className="mb-2.5 block">
                        Type of Injury/Condition
                      </Label>
                      <Input
                        id="injury_type"
                        value={formData.injury_type || ""}
                        onChange={(e) =>
                          updateFormData({ injury_type: e.target.value })
                        }
                        placeholder="Describe your injury or condition"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recovery_stage" className="mb-2.5 block">
                        Current Recovery Stage
                      </Label>
                      <Select
                        value={formData.recovery_stage || ""}
                        onValueChange={(value) =>
                          updateFormData({ recovery_stage: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your recovery stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acute">
                            Acute (0-2 weeks)
                          </SelectItem>
                          <SelectItem value="subacute">
                            Subacute (2-6 weeks)
                          </SelectItem>
                          <SelectItem value="chronic">
                            Chronic (6+ weeks)
                          </SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {selectedGoalType?.id === "body_transformation" && (
                <div className="col-span-2 space-y-4 border-t mt-4">
                  <h4 className="font-medium text-lg pt-2">
                    Transformation Goals
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current_photo" className="mb-2.5 block">
                        Current Photo (optional)
                      </Label>
                      <Input
                        id="current_photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateFormData({ current_photo: file });
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a current photo to track your transformation
                      </p>
                    </div>
                    <div>
                      <Label
                        htmlFor="transformation_goal"
                        className="mb-2.5 block"
                      >
                        Specific Transformation Goal
                      </Label>
                      <Textarea
                        id="transformation_goal"
                        value={formData.transformation_goal || ""}
                        onChange={(e) =>
                          updateFormData({
                            transformation_goal: e.target.value,
                          })
                        }
                        placeholder="Describe your transformation goals..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedGoalType?.id === "custom" && (
                <div className="col-span-2 space-y-4">
                  <h4 className="font-medium text-lg">Custom Goal Details</h4>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="custom_goal_description"
                        className="mb-2.5 block"
                      >
                        Describe Your Goal
                      </Label>
                      <Textarea
                        id="custom_goal_description"
                        value={formData.custom_goal_description || ""}
                        onChange={(e) =>
                          updateFormData({
                            custom_goal_description: e.target.value,
                          })
                        }
                        placeholder="Describe your custom goal in detail..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="custom_metrics"
                          className="mb-2.5 block"
                        >
                          Key Metrics to Track
                        </Label>
                        <Input
                          id="custom_metrics"
                          value={formData.custom_metrics || ""}
                          onChange={(e) =>
                            updateFormData({ custom_metrics: e.target.value })
                          }
                          placeholder="e.g., weight, reps, time, etc."
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="custom_timeline"
                          className="mb-2.5 block"
                        >
                          Expected Timeline
                        </Label>
                        <Input
                          id="custom_timeline"
                          value={formData.custom_timeline || ""}
                          onChange={(e) =>
                            updateFormData({ custom_timeline: e.target.value })
                          }
                          placeholder="e.g., 3 months, 6 months, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return <StepEquipmentRestrictions />;
      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="why_goal" className="text-base font-medium">
                  Why is this goal important to you?
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  Be specific - this will help during challenging times
                </p>
                <Textarea
                  id="why_goal"
                  value={formData.why_this_goal}
                  onChange={(e) =>
                    updateFormData({ why_this_goal: e.target.value })
                  }
                  placeholder="e.g., I want to feel confident in my own skin, have energy to play with my kids, improve my health markers..."
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-base font-medium">
                  Have you tried achieving this goal before?
                </Label>
                <RadioGroup
                  value={formData.previous_attempts ? "yes" : "no"}
                  onValueChange={(value) =>
                    updateFormData({ previous_attempts: value === "yes" })
                  }
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no_attempts" />
                    <Label htmlFor="no_attempts">
                      No, this is my first time
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes_attempts" />
                    <Label htmlFor="yes_attempts">Yes, I've tried before</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">Support System</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Who will support you on this journey?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {supportOptions.map((support) => (
                    <div key={support} className="flex items-center space-x-2">
                      <Checkbox
                        id={support}
                        checked={formData.support_system.includes(support)}
                        onCheckedChange={(checked) => {
                          const updated = checked
                            ? [...formData.support_system, support]
                            : formData.support_system.filter(
                                (s) => s !== support
                              );
                          updateFormData({ support_system: updated });
                        }}
                      />
                      <Label htmlFor={support} className="text-sm">
                        {support}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="priority"
                  className="text-base font-medium mb-1.5 block"
                >
                  Goal Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    updateFormData({ priority: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How important is this goal?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Nice to have</SelectItem>
                    <SelectItem value="medium">
                      Medium - Important to me
                    </SelectItem>
                    <SelectItem value="high">High - Very important</SelectItem>
                    <SelectItem value="critical">
                      Critical - Life-changing
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="mb-2.5 block">
                    Goal Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="Give your goal a motivating title"
                  />
                </div>

                <div>
                  <Label className="mb-2.5 block">Date Range</Label>
                  <DateRangePicker
                    value={{
                      from: formData.start_date
                        ? new Date(formData.start_date)
                        : undefined,
                      to: formData.target_date
                        ? new Date(formData.target_date)
                        : undefined,
                    }}
                    onChange={(range) => {
                      updateFormData({
                        start_date: range?.from
                          ? new Date(range.from).toISOString().split("T")[0]
                          : formData.start_date,
                        target_date: range?.to
                          ? new Date(range.to).toISOString().split("T")[0]
                          : formData.target_date,
                      });
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2.5 block">Estimated Duration</Label>
                  <div className="px-2">
                    <Slider
                      value={[formData.estimated_duration_weeks]}
                      onValueChange={(value) => {
                        const weeks = value[0];
                        updateFormData({
                          estimated_duration_weeks: weeks,
                          target_date: new Date(
                            Date.now() + weeks * 7 * 24 * 60 * 60 * 1000
                          )
                            .toISOString()
                            .split("T")[0],
                        });
                      }}
                      max={52}
                      min={4}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>4 weeks</span>
                      <span className="font-medium">
                        {formData.estimated_duration_weeks} weeks
                      </span>
                      <span>1 year</span>
                    </div>
                  </div>
                </div>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">AI Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      <span>
                        Optimal duration: {selectedGoalType?.estimatedWeeks}{" "}
                        weeks
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>
                        Success rate: {selectedGoalType?.successRate}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>Community support available</span>
                    </div>
                  </div>
                </Card>

                <div>
                  <Label htmlFor="description" className="mb-2.5 block">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      updateFormData({ description: e.target.value })
                    }
                    placeholder="Any additional details about your goal..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <StepGoalType />;
    }
  };

  return (
    <div className="w-full mx-auto xl:px-2">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      {renderCurrentStep()}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden md:block">Back</span>
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleComplete}
              className="flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>Create Goal</span>
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="flex items-center space-x-2"
              disabled={!isCurrentStepValid()}
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartGoalWizard;
