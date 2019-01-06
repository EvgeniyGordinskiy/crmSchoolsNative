import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import * as AuthReducer from '../../../../store/auth/reducers';
import {User} from '../../../../models/user';
import {PaymentService} from '../../../../services/payment/payment.service';

@Component({
  selector: 'DashboardPage',
  templateUrl: './dashboard-page.component.html',
  moduleId: module.id,
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  user: User;
  constructor(
    private authStore: Store<AuthReducer.AuthState>,
    private paymentService: PaymentService,
  ) { }

  ngOnInit() {
    this.authStore.subscribe(
      (val) => {
        const auth = val.auth;
        if (auth && auth.user) {
          this.user = auth.user;
        }
      }
    );
  }

  payForOwner() {
    this.paymentService.createChargeForOwner(1000)
      .subscribe(
        resp => console.log(resp),
        err => console.log(err),
      )
  }

}
