import {Permission} from './permission';
import {UserInterface} from '../interfaces/user.interface';
import {School} from './shool';
import {AddressInterface} from '../interfaces/address.interface';
import {Subscription} from './subscription';
import {Attendance} from './attendance';
import {Class} from './class';

export class User implements UserInterface {
  id?: number;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  default_currency?: string;
  phone?: string;
  emailVerified? = false;
  phoneNumberVerified? = false;
  paymentSettingVerified? = false;
  notAdmin?: boolean;
  hasProgram?: boolean;
  avatar?: string;
  provider_id?: string;
  provider_name?: string;
  registerNotComplete?: boolean;
  permissions?: {
    key?: [Permission]
  };
  family?: User[];
  schools?: [School];
  usedAuthSocial?: boolean|string = false;
  activeSchool?: number;
  parent_id?: number;
  programs_id?: number[];
  classes_id?: number[];
  address?: AddressInterface;
  subscriptions?: Subscription[];
  current_lesson?: Attendance;
  password?: string;
  old_password?: string;
  password_confirm?: string;
  yearAttendanceFromApi?: Attendance[];
  invited?: boolean;
  classes?: Class[];
  not_read_messages?: number;

  constructor(params?: User) {
    if (params) {
      this.registerNotComplete = params.registerNotComplete;
      this.not_read_messages = params.not_read_messages;
      this.current_lesson = params.current_lesson;
      this.default_currency = params.default_currency;
      this.email = params.email;
      this.subscriptions = params.subscriptions;
      this.name = params.name;
      this.first_name = params.first_name;
      this.last_name = params.last_name;
      this.programs_id = params.programs_id;
      this.classes_id = params.classes_id;
      this.role = params.role;
      this.phone = params.phone;
      this.address = params.address;
      this.notAdmin = params.notAdmin;
      this.parent_id = params.parent_id;
      this.family = params.family;
      this.avatar = params.avatar;
      this.activeSchool = params.activeSchool;
      this.permissions = params.permissions;
      this.schools = params.schools;
      this.hasProgram = params.hasProgram;
      this.id = params.id ? params.id : null;
      this.provider_id = params.provider_id ? params.provider_id : 'null';
      this.provider_name = params.provider_name ? params.provider_name : 'null';
      this.emailVerified = params.emailVerified ? params.emailVerified : false;
      this.phoneNumberVerified = params.phoneNumberVerified ? params.phoneNumberVerified : false;
      this.paymentSettingVerified = params.paymentSettingVerified ? params.paymentSettingVerified : false;
    }
  }
  //
  // isStudent() {
  //   return this.role === 'student_individual';
  // }
}
