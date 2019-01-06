import {AddressInterface} from '../interfaces/address.interface';

export class Address implements AddressInterface {
  address_line_1 = '';
  locality = '';
  administrative_area_level_1 = '';
  postal_code = '';
  country = '';
  location_id ?= '';
}
