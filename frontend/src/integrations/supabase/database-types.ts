
// Define types for all database tables
export interface HealthMetrics {
  id: string;
  user_id: string;
  date: string;
  heart_rate: number;
  steps: number;
  sleep: number;
  water: number;
  active_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface PackagingInfo {
  manufacturing_date: string;
  expiry_date: string;
  packaging_type: string;
  origin: string;
}

export interface FoodScan {
  protein: number;
  carbs: number;
  fat: number;
  id: string;
  user_id: string;
  name: string;
  type: string;
  scan_date: string;
  image_url: string;
  health_score: number;
  health_advice: string;
  allergens: string[];
  ingredients: string[];
  extracted_text: string;
  product_recognized: boolean;
  image_type: string;
  product_brand: string;
  nutrition: NutritionInfo;
  packaging_info: PackagingInfo;
  health_claims: string[];
  certifications: string[];
  is_inappropriate: boolean;
  created_at: string;
  updated_at: string;
}

export interface NutritionMeal {
  id: string;
  user_id: string;
  name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  image_url: string | null;
  serving_size: string | null;
  consumed_at: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'user' | 'admin';

// Notification types
export type NotificationType = 
  | 'food_scan_low_score'
  | 'welcome'
  | 'achievement'
  | 'health_update'
  | 'nutrition_reminder'
  | 'system_update'
  | 'security_alert'
  | 'subscription_update'
  | 'daily_summary'
  | 'goal_reached'
  | 'streak_milestone';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  data: any;
  action_url: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  food_scan_low_score: boolean;
  welcome: boolean;
  achievement: boolean;
  health_update: boolean;
  nutrition_reminder: boolean;
  system_update: boolean;
  security_alert: boolean;
  subscription_update: boolean;
  daily_summary: boolean;
  goal_reached: boolean;
  streak_milestone: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

// Database tables for Supabase
export type Tables = {
  health_metrics: HealthMetrics;
  food_scans: FoodScan;
  nutrition_meals: NutritionMeal;
  notifications: Notification;
  notification_preferences: NotificationPreferences;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    onboarded: boolean;
    subscription_tier: string;
    interests: string[] | null;
    daily_calories_target: number;
    daily_protein_target: number;
    daily_carbs_target: number;
    daily_fat_target: number;
    daily_fiber_target: number;
    daily_sugar_limit: number;
    dietary_restrictions: string[];
    meal_reminders: boolean;
    meal_types: string[];
    created_at: string;
    updated_at: string;
  };
  blog_posts: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    cover_image: string;
    author: any;
    category: string;
    status: string;
    read_time: number;
    created_at: string;
    updated_at: string;
  };
  subscriptions: {
    id: string;
    user_id: string;
    plan: string;
    status: string;
    amount: number;
    current_period_start: string;
    current_period_end: string;
    created_at: string;
    updated_at: string;
  };
  user_roles: UserRole;
}

// Updated Database Type
export type Database = {
  public: {
    Tables: {
      health_metrics: {
        Row: HealthMetrics;
        Insert: Omit<HealthMetrics, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HealthMetrics, 'id'>>;
      };
      food_scans: {
        Row: FoodScan;
        Insert: Omit<FoodScan, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FoodScan, 'id'>>;
      };
      nutrition_meals: {
        Row: NutritionMeal;
        Insert: Omit<NutritionMeal, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NutritionMeal, 'id'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Notification, 'id'>>;
      };
      notification_preferences: {
        Row: NotificationPreferences;
        Insert: Omit<NotificationPreferences, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NotificationPreferences, 'id'>>;
      };
      profiles: {
        Row: Tables['profiles'];
        Insert: Omit<Tables['profiles'], 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tables['profiles'], 'id'>>;
      };
      blog_posts: {
        Row: Tables['blog_posts'];
        Insert: Omit<Tables['blog_posts'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tables['blog_posts'], 'id'>>;
      };
      subscriptions: {
        Row: Tables['subscriptions'];
        Insert: Omit<Tables['subscriptions'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tables['subscriptions'], 'id'>>;
      };
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserRole, 'id'>>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
