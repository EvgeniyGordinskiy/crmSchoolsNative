import {StudentInterface} from '../interfaces/student.interface';

export class Student implements StudentInterface {
  first_name: string;
  last_name: string;
  avatar?: string;
  email: string;
  address: string;
  phone: string;
}
