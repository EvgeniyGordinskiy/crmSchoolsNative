export class TeacherSubscription {
  id: number;
  teacher_id: number;
  auto_renew: boolean;
  status: number;
  class_id: number;
  class_name: string;
  amount: number;
  frequency_payment: string;
  payment_day: number;
  range_payment: string;
  start_work_at: string;
  end_work_at: string;
  payout_limit: number;
  end_option: string;
  payment_week_day: string;
}
