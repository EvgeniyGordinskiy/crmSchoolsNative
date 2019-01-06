import {ProgramInterface} from '../interfaces/program.interface';
import {Schedule} from './schedule';
import {Class} from './class';
import {User} from './user';
import {Subscription} from './subscription';
import {Curriculum} from './curriculum';

export class Program implements ProgramInterface {
  id?: number;
  program_id?: number;
  program_name: string;
  repeat: string;
  program_description: string;
  lastAction?: string;
  schedule: Schedule[] ;
  /**
   *  replaced_schedule will create, when repeated program add to class unique schedule.
   */
  replaced_schedule: Schedule[] ;
  default_teacher: User ;
  classes: Class[] ;
  teacher_id?: number;
  teachers?: User[];
  subscriptions?: Subscription[];
  curriculum?: Curriculum[];
  fromApischedule?: any;
  start_curriculum?: string;
  end_curriculum?: string;
  preview?: boolean;
}
