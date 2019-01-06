import {AccountServiceResponseInterface} from './accountServiceResponse.interface';

export interface AuthenticateResponseInterface {
  data: {
    token: string
    authUser?: AccountServiceResponseInterface;
    status?: number;
  };
}
