import {TeacherInterface} from '../interfaces/teacher.interface';

export class Teacher implements TeacherInterface {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string;
  email: string;
  address: string;
  phone: string;
}
