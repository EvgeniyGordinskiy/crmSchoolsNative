import {Teacher} from './teacher';
import {Student} from './student';
import {Schedule} from './schedule';
import {User} from './user';
import {Lesson} from './lesson';
import {TeacherSubscription} from './teacherSubscription';

export class Class {
  id: number;
  name: string;
  program_id: number;
  program_name: string;
  description: string;
  schedule: Schedule[];
  /**
   *  Unique schedules will create, when repeated program add to class unique schedule.
   */
  replaced_schedule: Schedule[] ;
  selectedSchedule: Schedule[];
  teachers: User[];
  students: User[];
  styles?: any;
  cssClass?: any;
  selectedDay?: any;
  momentStart?: any;
  momentEnd?: any;
  lesson: Lesson
  subscription?: TeacherSubscription;
}
