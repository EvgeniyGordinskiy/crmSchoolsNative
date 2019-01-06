import {Permission} from '../models/permission';
import {School} from '../models/shool';
import {User} from '../models/user';
import {AddressInterface} from '../interfaces/address.interface';

export interface UserInterface {
  id?: number;
  email?: string;
  hasProgram?: boolean;
  phone?: string;
  avatar?: string;
  provider_id?: string;
  provider_name?: string;
  emailVerified?: boolean;
  phoneNumberVerified?: boolean;
  paymentSettingVerified?: boolean;
  name?: string;
  role?: string;
  permissions?: {
    key?: [Permission]
  };
  schools?: [School];
  family?: User[];
  usedAuthSocial?: boolean|string;
  parent_id?: number;
  address?: AddressInterface;
}
