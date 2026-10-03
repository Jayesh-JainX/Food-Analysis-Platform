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

export type UserRole = "user" | "admin";

// Notification types
export type NotificationType =
  | "food_scan_low_score"
  | "welcome"
  | "achievement"
  | "health_update"
  | "nutrition_reminder"
  | "system_update"
  | "security_alert"
  | "subscription_update"
  | "daily_summary"
  | "goal_reached"
  | "streak_milestone";

export type NotificationPriority = "low" | "medium" | "high" | "critical";

// prefixed with Db to avoid name collisions with local UI types in hooks
export interface DbNotificationRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  data: unknown;
  action_url: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbNotificationPreferencesRow {
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

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at?: string;
}

export interface ProfileRecord {
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
}

export interface BlogPostRecord {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author: unknown;
  category: string;
  status: string;
  read_time: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  amount: number;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

// Updated Database Type - satisfies Supabase JS v2 GenericTable constraints
export type Database = {
  public: {
    Tables: {
      health_metrics: {
        Row: HealthMetrics;
        Insert: Partial<HealthMetrics> & { user_id: string };
        Update: Partial<HealthMetrics>;
        Relationships: [];
      };
      food_scans: {
        Row: FoodScan;
        Insert: Partial<FoodScan> & { user_id: string; name: string };
        Update: Partial<FoodScan>;
        Relationships: [];
      };
      nutrition_meals: {
        Row: NutritionMeal;
        Insert: Partial<NutritionMeal> & { user_id: string; name: string };
        Update: Partial<NutritionMeal>;
        Relationships: [];
      };
      notifications: {
        Row: DbNotificationRow;
        Insert: Partial<DbNotificationRow> & {
          user_id: string;
          title: string;
          description: string;
          type: NotificationType;
        };
        Update: Partial<DbNotificationRow>;
        Relationships: [];
      };
      notification_preferences: {
        Row: DbNotificationPreferencesRow;
        Insert: Partial<DbNotificationPreferencesRow> & { user_id: string };
        Update: Partial<DbNotificationPreferencesRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRecord;
        Insert: Partial<ProfileRecord> & { id: string };
        Update: Partial<ProfileRecord>;
        Relationships: [];
      };
      blog_posts: {
        Row: BlogPostRecord;
        Insert: Partial<BlogPostRecord> & { title: string };
        Update: Partial<BlogPostRecord>;
        Relationships: [];
      };
      subscriptions: {
        Row: SubscriptionRecord;
        Insert: Partial<SubscriptionRecord> & { user_id: string; plan: string };
        Update: Partial<SubscriptionRecord>;
        Relationships: [];
      };
      user_roles: {
        Row: UserRoleRecord;
        Insert: Partial<UserRoleRecord> & { user_id: string; role: UserRole };
        Update: Partial<UserRoleRecord>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_notification: {
        Args: {
          p_user_id: string;
          p_title: string;
          p_description: string;
          p_type: NotificationType;
          p_priority?: NotificationPriority;
          p_data?: unknown;
          p_action_url?: string;
        };
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
  };
};
