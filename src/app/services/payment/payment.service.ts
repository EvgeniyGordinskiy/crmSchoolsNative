import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StartSpinner} from '../../store/spinner/actions';
import * as SpinnerReducer from '../../store/spinner/reducers';
import {Store} from '@ngrx/store';
import * as AuthReducer from '../../store/auth/reducers';
import {User} from '../../models/user';
import {PayoutModalObject} from '../../interfaces/payoutModalObject';

@Injectable()
export class PaymentService {
  user: User;
  constructor(
    private httpClient: HttpClient,
    private authStore: Store<AuthReducer.AuthState>,
    private spinnerStore: Store<SpinnerReducer.SpinnerState>
  ) {
    this.authStore.subscribe(
      (val) => {
        const auth = val.auth;
        if (auth && auth.user) {
          this.user = auth.user;
        }
      }
    );
  }

  savePaymentsSettings(body: object) {
    return this.httpClient.post('payment/settings', body);
  }
  getPaymentsSettings(user: User) {
    return this.httpClient.get('payment/settings/'+user.id);
  }
  getPaymentsStatisticByMonth(program_id: number) {
    if (this.user.activeSchool) {
      this.spinnerStore.dispatch(new StartSpinner());
      const school_id = this.user.activeSchool;
      return this.httpClient.get(school_id+'/payment/by_month/' + program_id);
    }
    return new Observable();
  }
  getPeyoutsList(user_id = null) {
    if (this.user.activeSchool) {
      this.spinnerStore.dispatch(new StartSpinner());
      const school_id = this.user.activeSchool;
      const usersId = user_id ? '/'+user_id : '';
      return this.httpClient.get(school_id+'/payment/payouts_list' + usersId);
    }
    return new Observable();
  }
  getPaymentsInformation(user_id = null) {
    if (!user_id && this.user) {
      user_id = this.user.id;
    }
    return this.httpClient.get('payment/' + user_id);
  }
  createChargeForProgram(program_id: number, subscription_id: number) {
    return this.httpClient.post('payment/charge_program', {program_id: program_id, subscription_id: subscription_id});
  }

  /**
   * Start methods for payouts
   */
  createChargeForTeacher(body: {payouts: PayoutModalObject[]}) {
    if (this.user.activeSchool) {
      this.spinnerStore.dispatch(new StartSpinner());
      const school_id = this.user.activeSchool;
      return this.httpClient.post(school_id + '/payment/payout_teacher', body);
    }
    return new Observable();
  }
  getPayOutStastic() {
    if (this.user.activeSchool) {
      this.spinnerStore.dispatch(new StartSpinner());
      const school_id = this.user.activeSchool;
      return this.httpClient.get(school_id + '/payment/payout_teacher');
    }
    return new Observable();
  }
  /**
   * End methods for payouts
   */
  createChargeForOwner(amount: number) {
    if (this.user.activeSchool) {
      this.spinnerStore.dispatch(new StartSpinner());
      const school_id = this.user.activeSchool;
      return this.httpClient.post(school_id+'/payment/charge_owner', {amount: amount, user_id: 1});
    }
    return new Observable();
  }
  putToBalance(amount: number) {
    if (this.user) {
      return this.httpClient.post('payment/putToBalance', {amount: amount, user_id: this.user.id});
    }
    return new Observable();
  }
  payOnholdFee( body: {program_id: number, subscription_id: number, user_id: number, type: string}) {
    return this.httpClient.post('payment/charge_program', body);
  }
  getDiscount(body: {subscription_id: number, userSubscription_id: number, price: number}) {
    return this.httpClient.post('payment/price_with_discount', body);
  }
}
