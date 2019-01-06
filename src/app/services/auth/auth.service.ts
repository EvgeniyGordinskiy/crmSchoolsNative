import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

// @ngrx
import { Store } from '@ngrx/store';

// rxjs


import * as SpinnerReducer from '../../store/spinner/reducers';
import {StartSpinner} from '../../store/spinner/actions';

@Injectable()
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private store: Store<SpinnerReducer.SpinnerState>
  ) { }

  login({email, password, rememberMe}) {
      console.log('login');
      this.store.dispatch(new StartSpinner());
    return  this.httpClient.post('auth', {email, password, rememberMe});
  }

  loginBySocialAcc(provider: string, token: string) {
    return this.httpClient.post(`social/${provider}`, {token: token})
  }

  register(body) {
    this.store.dispatch(new StartSpinner());
    return  this.httpClient.post('auth/register', body);
  }

  sendEmailForResettingPassword(email: string, redirect: string) {
    this.store.dispatch(new StartSpinner());
    return  this.httpClient.post('password/change', {email: email, redirectPath: redirect});
  }

  sendEmail(email: string, redirect: string) {
    this.store.dispatch(new StartSpinner());
    return  this.httpClient.post('verify/email', {email: email, redirectPath: redirect});
  }

  sendSms(email: string) {
    this.store.dispatch(new StartSpinner());
    return  this.httpClient.post('verify/sms', {email: email});
  }

  resetPassword({password, password_confirmation}) {
    this.store.dispatch(new StartSpinner());
    return  this.httpClient.post('password/reset', {password, password_confirmation});
  }

  checkResetPasswordToken(token: string) {
    this.store.dispatch(new StartSpinner());
    return  this.httpClient.post('auth/checkToken', {token: token});
  }
}
