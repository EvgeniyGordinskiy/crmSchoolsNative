export interface CreateStudent {
  first_name: string;
  last_name: string;
  role_name: string;
  avatar?: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  phone: string;
  parent_id?: number;
  address_line_1?: string;
  locality?: string;
  administrative_area_level_1?: string;
  postal_code?: string;
  country?: string;
  location_id?: string;
  classc_id?: string;
  program_id?: string;
}
