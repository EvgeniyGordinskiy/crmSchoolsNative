import {User} from '../../models/user';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AccountServiceResponseInterface} from '../../interfaces/accountServiceResponse.interface';
import {Address} from '../../models/address';

const localStorage = require( "nativescript-localstorage" );

@Injectable()
export class AuthFacade {
  private static prefix = 'auth_schools_';

  static getUser = () => {
    const userJsn = localStorage.getItem(AuthFacade.prefix + 'user');
    if (typeof userJsn !== 'undefined' && userJsn !== 'undefined') {
      return JSON.parse(localStorage.getItem(AuthFacade.prefix + 'user'));
    }
  }

  public constructor(
    private router: Router,
  ) {}

  static setToken = (token: string, prefix = AuthFacade.prefix) => {
    localStorage.setItem(prefix + 'token', token);
  }

  static getToken = (prefix = AuthFacade.prefix): string => {
    return localStorage.getItem(prefix + 'token');
  }

  static setUser = (user: User) => {
    localStorage.setItem(AuthFacade.prefix + 'user', JSON.stringify(user));
  };
  private notAuthnticatePages = [
    '/register',
    '/login',
    '/resetPassword',
    '/setup'
  ];

  static setAuthStatus = (status: boolean) => {
    localStorage.setItem(AuthFacade.prefix + 'status', status.toString());
  };

  static getAuthStatus = () => {
    return localStorage.getItem(AuthFacade.prefix + 'status') === 'true';
  };

  checkAuthStatusAndRedirect(object) {
      console.log(AuthFacade.getAuthStatus());
    setTimeout(() => {
      if (AuthFacade.getAuthStatus()) {
          object.navigateTo('/layout/dashboard');
      } else if (!AuthFacade.getAuthStatus() && !this.notAuthnticatePages.includes(this.router.url.split('?')[0])) {
          object.navigateTo('/login');
      }
    }, 45);
  }

  pageNeedAuth() {
    const url = this.router.url.split('?')[0];
    return !this.notAuthnticatePages.includes(url);
  }

  endSession(redirect: boolean) {
    if (redirect === true) {
      const uri = window.location.origin + '/#/login';
      window.location.href = uri;
    }
    AuthFacade.setUser(new User());
    AuthFacade.setToken('');
    AuthFacade.setAuthStatus(false);
  }

  public createUser(response: AccountServiceResponseInterface, permissions = {}): User {
    console.log(response);
    return new User({
     id: response.data.id,
     name: response.data.name,
      not_read_messages: response.data.not_read_messages,
      subscriptions: response.data.subscriptions,
     first_name: response.data.first_name,
     default_currency: response.data.default_currency,
     last_name: response.data.last_name,
     programs_id: response.data.programs_id,
     classes_id: response.data.classes_id,
     email: response.data.email,
     address: response.data.address ? response.data.address : new Address(),
     family: response.data.family,
     parent_id: response.data.parent_id,
     notAdmin: (response.data.role as string) !== 'admin' && (response.data.role as string) !== 'super_admin',
     avatar: response.data.avatar,
     role: response.data.role,
     emailVerified: response.data.emailVerified,
     phoneNumberVerified: response.data.phoneNumberVerified,
     registerNotComplete: response.data.registerNotComplete,
    permissions: permissions,
     phone: response.data.phone,
     current_lesson: response.data.current_lesson,
     schools: response.data.schools,
     paymentSettingVerified: response.data.paymentSettingVerified,
     usedAuthSocial: response.data.usedAuthSocial ? response.data.usedAuthSocial : false,
     hasProgram: response.data.hasProgram ? response.data.hasProgram : false
  });
  }

}
