import {Schedule} from '../models/schedule';

export interface ProgramInterface {
  id?: number;
  program_name: string;
  program_description: string;
  schedule: Schedule[];
  teacher_id?: number;
}
