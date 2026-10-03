import {
  TrendingUp,
  Dumbbell,
  Target,
  Trophy,
  Medal,
  Timer,
  Zap,
  Heart,
  Brain,
  Star,
  Plus
} from 'lucide-react';

export interface GoalType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  estimatedWeeks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  prerequisites?: string[];
  benefits: string[];
  commonMistakes: string[];
  successRate: number;
}

export const goalTypes: GoalType[] = [
  {
    id: 'fat_loss',
    name: 'Fat Loss / Weight Loss',
    icon: TrendingUp,
    color: 'bg-red-500',
    description: 'Lose weight sustainably through proper nutrition and exercise',
    estimatedWeeks: 12,
    difficulty: 'Medium',
    benefits: ['Improved health markers', 'Increased energy', 'Better sleep', 'Enhanced confidence'],
    commonMistakes: ['Too aggressive calorie deficit', 'Ignoring strength training', 'Unrealistic timeline'],
    successRate: 73
  },
  {
    id: 'muscle_gain',
    name: 'Muscle Gain / Bulking',
    icon: Dumbbell,
    color: 'bg-blue-500',
    description: 'Build lean muscle mass through progressive resistance training',
    estimatedWeeks: 16,
    difficulty: 'Hard',
    prerequisites: ['Basic gym knowledge', 'Consistent workout schedule'],
    benefits: ['Increased strength', 'Better metabolism', 'Improved body composition', 'Enhanced performance'],
    commonMistakes: ['Insufficient protein intake', 'Poor recovery', 'Impatient with results'],
    successRate: 68
  },
  {
    id: 'lean_body',
    name: 'Lean / Slim Body',
    icon: Target,
    color: 'bg-green-500',
    description: 'Achieve a lean, toned physique with balanced muscle and low body fat',
    estimatedWeeks: 14,
    difficulty: 'Medium',
    benefits: ['Athletic appearance', 'Functional strength', 'Balanced physique', 'Sustainable lifestyle'],
    commonMistakes: ['Cardio-only approach', 'Under-eating', 'Neglecting strength training'],
    successRate: 71
  },
  {
    id: 'six_pack_abs',
    name: 'Six-Pack Abs / Core',
    icon: Trophy,
    color: 'bg-yellow-500',
    description: 'Develop visible abdominal muscles through targeted training and nutrition',
    estimatedWeeks: 12,
    difficulty: 'Hard',
    prerequisites: ['Low body fat percentage', 'Core training experience'],
    benefits: ['Core strength', 'Better posture', 'Athletic performance', 'Visual appeal'],
    commonMistakes: ['Focusing only on abs', 'Ignoring diet', 'Unrealistic expectations'],
    successRate: 45
  },
  {
    id: 'army_military_prep',
    name: 'Army / Military Fitness',
    icon: Medal,
    color: 'bg-gray-700',
    description: 'Comprehensive military fitness preparation for all physical standards',
    estimatedWeeks: 20,
    difficulty: 'Very Hard',
    prerequisites: ['Medical clearance', 'Basic fitness level'],
    benefits: ['Military readiness', 'Mental toughness', 'Functional fitness', 'Career opportunities'],
    commonMistakes: ['Overtraining', 'Neglecting flexibility', 'Poor recovery'],
    successRate: 82
  },
  {
    id: 'marathon_running',
    name: 'Marathon / Running Goals',
    icon: Timer,
    color: 'bg-orange-500',
    description: 'Train for long-distance running events and endurance challenges',
    estimatedWeeks: 24,
    difficulty: 'Hard',
    prerequisites: ['Base running experience', 'Injury-free status'],
    benefits: ['Cardiovascular health', 'Mental resilience', 'Achievement satisfaction', 'Community'],
    commonMistakes: ['Too much too soon', 'Ignoring rest days', 'Wrong shoes/gear'],
    successRate: 65
  },
  {
    id: 'strength_powerlifting',
    name: 'Strength / Powerlifting',
    icon: Zap,
    color: 'bg-purple-500',
    description: 'Increase maximum strength in the big three lifts (squat, bench, deadlift)',
    estimatedWeeks: 18,
    difficulty: 'Hard',
    prerequisites: ['Proper form knowledge', 'Training consistency'],
    benefits: ['Maximum strength', 'Power development', 'Athletic performance', 'Personal records'],
    commonMistakes: ['Poor form', 'Inadequate warm-up', 'Ego lifting'],
    successRate: 71
  },
  {
    id: 'flexibility_mobility',
    name: 'Flexibility & Mobility',
    icon: Heart,
    color: 'bg-pink-500',
    description: 'Improve joint mobility, flexibility, and movement quality',
    estimatedWeeks: 10,
    difficulty: 'Easy',
    benefits: ['Better movement', 'Injury prevention', 'Pain relief', 'Quality of life'],
    commonMistakes: ['Inconsistent practice', 'Forcing stretches', 'Ignoring strength'],
    successRate: 89
  },
  {
    id: 'mental_wellness',
    name: 'Mental Wellness & Stress',
    icon: Brain,
    color: 'bg-indigo-500',
    description: 'Improve mental health through exercise, meditation, and lifestyle changes',
    estimatedWeeks: 8,
    difficulty: 'Medium',
    benefits: ['Stress reduction', 'Better mood', 'Improved focus', 'Life satisfaction'],
    commonMistakes: ['Expecting instant results', 'Inconsistent practice', 'Neglecting sleep'],
    successRate: 76
  },
  {
    id: 'rehabilitation',
    name: 'Rehabilitation / Recovery',
    icon: Heart,
    color: 'bg-emerald-500',
    description: 'Recover from injury and restore full function safely',
    estimatedWeeks: 16,
    difficulty: 'Medium',
    prerequisites: ['Medical clearance', 'Professional guidance'],
    benefits: ['Pain relief', 'Function restoration', 'Injury prevention', 'Confidence'],
    commonMistakes: ['Rushing recovery', 'Ignoring pain', 'Skipping therapy'],
    successRate: 78
  },
  {
    id: 'body_transformation',
    name: 'Body Transformation',
    icon: Star,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    description: 'Complete lifestyle and physique transformation',
    estimatedWeeks: 24,
    difficulty: 'Very Hard',
    prerequisites: ['Strong commitment', 'Lifestyle flexibility'],
    benefits: ['Complete makeover', 'Lifestyle change', 'Confidence boost', 'Health improvement'],
    commonMistakes: ['Unrealistic timeline', 'All-or-nothing mindset', 'Lack of support'],
    successRate: 52
  },
  {
    id: 'custom',
    name: 'Custom Goal',
    icon: Plus,
    color: 'bg-gray-500',
    description: 'Create your own personalized goal',
    estimatedWeeks: 12,
    difficulty: 'Medium',
    benefits: ['Personalized approach', 'Flexible timeline', 'Custom metrics'],
    commonMistakes: ['Unclear objectives', 'Lack of structure', 'Unrealistic expectations'],
    successRate: 60
  }
];

export const getGoalTypeById = (id: string): GoalType | undefined => {
  return goalTypes.find(type => type.id === id);
}; 