export type BillingCycle = 'Monthly' | 'Yearly' | 'Quarterly';
export type SubscriptionStatus = 'Active' | 'Upcoming' | 'Cancelled';
export type SubscriptionCategory = 
  | 'Software' 
  | 'Streaming' 
  | 'Infrastructure' 
  | 'Cloud' 
  | 'Utilities' 
  | 'Fitness' 
  | 'Other';

export interface Subscription {
  id: number;
  name: string;
  category: SubscriptionCategory | string;
  amount: number | string;
  currency: string;
  billing_cycle: BillingCycle;
  next_billing_date: string;
  status: SubscriptionStatus;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export type SubscriptionInput = Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;

export interface CategoryDistribution {
  category: string;
  amount: number;
  percentage: number;
}

export interface SpendingTrendPoint {
  month: string;
  amount: number;
}

export interface SubscriptionMetrics {
  monthly_spend: number;
  annual_projection: number;
  active_count: number;
  upcoming_count: number;
  monthly_budget: number;
  remaining_budget: number;
  category_distribution: CategoryDistribution[];
  spending_trend: SpendingTrendPoint[];
  due_soon_subscriptions: Subscription[];
  top_impact_subscriptions: Subscription[];
}

export interface UserPreferences {
  id?: number;
  monthly_budget: number;
  currency: string;
  renewal_reminder_days: number;
  dark_mode: boolean;
  updated_at?: string;
}

export type ViewType = 'dashboard' | 'subscriptions' | 'analytics' | 'calendar' | 'settings';
