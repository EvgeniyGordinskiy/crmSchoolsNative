
import {tap} from 'rxjs/operators';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {AuthFacade} from '../../facades/auth/authFacade';
// import {ToastrService} from 'ngx-toastr';

// @ngrx
import { Store } from '@ngrx/store';

// rxjs



import * as SpinnerReducer from '../../store/spinner/reducers';
import * as AuthReducer from '../../store/auth/reducers';
import {StopSpinner} from '../../store/spinner/actions';
import {SignOut} from '../../store/auth/actions';
import {Router} from '@angular/router';
// import {ResetPasswordComponent} from '@pages/auth/reset-password/reset-password.component';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    // private notificationManager: ToastrService,
    private store: Store<SpinnerReducer.SpinnerState>,
    private authStore: Store<AuthReducer.AuthState>,
    private authFacade: AuthFacade,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string;
    const pagesWithTokens = [
      '/auth/resetPassword',
      '/auth/setup',
      '/auth/register',
      '/auth/invite',
    ];
      token = AuthFacade.getToken();

      if (token) {
      req = req.clone({
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + token
        })
      });
    }
    return next.handle(req)
      .pipe(map( event => {
        if (event instanceof HttpResponse) {
          if (event.body.data && event.body.data.status) {
            event.body['status'] = event.body.data.status;
          } else {
            event.body['status'] = event.status;
          }
        }
        return event;
      })).pipe(
      tap(
      (event: HttpEvent<any>) => {
      this.store.dispatch(new StopSpinner());
    },
      (err: any) => {
        console.log(err);
        this.store.dispatch(new StopSpinner());
        if (err instanceof HttpErrorResponse) {
        if (err.status && err.status === 401 && this.router.url !== '/auth/login') {
          // this.notificationManager.error('User is not authorised', 'Error');
          this.authStore.dispatch(new SignOut(this.authFacade));
        } else if (err.error.error || err.error.errors) {
          const message = err.error.error ? err.error.error.message : err.error.errors;
          // this.notificationManager.error(message, 'Error' );
        } else {
          // this.notificationManager.error('An error has occurred', 'Error');
        }
      }
    }));
  }
}
