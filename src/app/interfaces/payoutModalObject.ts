export interface PayoutModalObject {
  date: string;
  teacher_id: number;
  amount: number;
  class_id?: number;
  attendances_ids?: number[];
  hours?: number;
  checked?: boolean;
  description?: string;
}
