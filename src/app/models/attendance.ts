import {Lesson} from './lesson';

export class Attendance {
  created_at: string;
  begin: string;
  end: string;
  id: number;
  program_id: number;
  subscription_id: number;
  user_id: number;
  schedule_id: number;
  lesson_id: number;
  user_subscription_id?: number;
  curriculum_id?: number;
  allCurriculumLessons?: Lesson[]
}
