import {ScheduleInterface} from '../interfaces/schedule.interface';
import {Lesson} from './lesson';

export class Schedule implements ScheduleInterface {
  id: number;
  start: string;
  end: string;
  day: string;
  deleted?: boolean;
  dayName: string;
  fullDayName: string;
  class_name: string;
  program_name: string;
  program_id: number;
  class_id: number;
  replaced_schedule: number;
  canceled: boolean;
  teachers: string;
  repeat_time: string;
  month: string;
  weekInMonth: string;
  year: string;
  date?: string;
  lesson: Lesson;
  subscription_id?: number;
}
