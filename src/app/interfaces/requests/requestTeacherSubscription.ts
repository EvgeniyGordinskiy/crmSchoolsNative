export interface RequestTeacherSubscription {
  class_id: number;
  range_payment: string;
  amount: number;
  auto_renew: boolean;
  frequency_payment: string;
  payment_week_day: string;
  payment_day: string;
  start_work_at: string;
  end_work_at?: string;
  payout_limit?: number;
}
