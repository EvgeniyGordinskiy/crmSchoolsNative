import {ActionInterface  as Action} from '../../interfaces/action.interface';
// @ngrx
import { Store } from '@ngrx/store';

// rxjs




// import type function
import { uniqueType } from '../../utils/uniqueType';

// import models
import { User } from '../../models/user';
import {AuthFacade} from '../../facades/auth/authFacade';
import {Injectable, OnInit} from '@angular/core';
import {UserInterface} from '../../interfaces/user.interface';

export const ActionTypes = {
  AUTHENTICATE: uniqueType('Authenticate'),
  AUTHENTICATE_ERROR: uniqueType('Authentication error'),
  AUTHENTICATE_SUCCESS: uniqueType('Authentication success'),
  AUTHENTICATED: uniqueType('Authenticated'),
  AUTHENTICATED_ERROR: uniqueType('Authenticated error'),
  AUTHENTICATED_SUCCESS: uniqueType('Authenticated success'),
  SIGN_OUT: uniqueType('SIGN_OUT'),
  SIGN_OUT_ERROR: uniqueType('Sign off error'),
  SIGN_OUT_SUCCESS: uniqueType('Sign off success'),
  SIGN_UP: uniqueType('Sign up'),
  SIGN_UP_ERROR: uniqueType('Sign up error'),
  SIGN_UP_SUCCESS: uniqueType('Sign up success'),
  REFRESH_AUTH_STATE: uniqueType('REFRESH_AUTH_STATE'),
  UPDATE_AUTH_USER: uniqueType('UPDATE_AUTH_USER'),
  TOOGLE_AUTH_USED: uniqueType('TOOGLE_AUTH_USED'),
  ADD_USER_TO_FAMILY: uniqueType('ADD_USER_TO_FAMILY'),
  UPDATE_NOT_READ_MESSAGES: uniqueType('UPDATE_NOT_READ_MESSAGES'),
};

/**
 * Authenticate.
 * @classes AuthenticateAction
 * @implements {Action}
 */
export class AuthenticateAction implements Action {
  readonly type: string = ActionTypes.AUTHENTICATE;
  constructor(token: string) {
    AuthFacade.setToken(token);
  }
}

/**
 * Checks if user is authenticated.
 * @classes AuthenticatedAction
 * @implements {Action}
 */
export class AuthenticatedAction implements Action {
  readonly type: string = ActionTypes.AUTHENTICATED;

  constructor(public payload?: {token?: string}) {}
}

/**
 * Authenticated check success.
 * @classes AuthenticatedSuccessAction
 * @implements {Action}
 */
export class AuthenticatedSuccessAction implements Action {
  readonly type: string = ActionTypes.AUTHENTICATED_SUCCESS;

  constructor(public payload: {authenticated: boolean, user: User}) {
    AuthFacade.setUser(payload.user);
    AuthFacade.setAuthStatus(payload.authenticated);
  }
}

/**
 * Authenticated check error.
 * @classes AuthenticatedErrorAction
 * @implements {Action}
 */
export class AuthenticatedErrorAction implements Action {
  readonly type: string = ActionTypes.AUTHENTICATED_ERROR;

  constructor(public payload?: any) {}
}

/**
 * Authentication error.
 * @classes AuthenticationErrorAction
 * @implements {Action}
 */
export class AuthenticationErrorAction implements Action {
  readonly type: string = ActionTypes.AUTHENTICATE_ERROR;

  constructor(public payload?: any) {}
}

/**
 * Authentication success.
 * @classes AuthenticationSuccessAction
 * @implements {Action}
 */
export class AuthenticationSuccessAction implements Action {
  readonly type: string = ActionTypes.AUTHENTICATE_SUCCESS;

  constructor(public payload: { user: User }) {}
}

/**
 * Sign up.
 * @classes SignUpAction
 * @implements {Action}
 */
export class SignUpAction implements Action {
  readonly type: string = ActionTypes.SIGN_UP;
  constructor(public payload: { user: User }) {}
}

/**
 * Sign up error.
 * @classes SignUpErrorAction
 * @implements {Action}
 */
export class SignUpErrorAction implements Action {
  readonly type: string = ActionTypes.SIGN_UP_ERROR;
  constructor(public payload?: any) {}
}

/**
 * Sign up success.
 * @classes SignUpSuccessAction
 * @implements {Action}
 */
export class SignUpSuccessAction implements Action {
  readonly type: string = ActionTypes.SIGN_UP_SUCCESS;
  constructor(public payload: { user: User }) {}
}

/**
 * Refresh auth status.
 * @classes RefreshAuthState
 * @implements {Action}
 */
export class RefreshAuthState implements Action {
  readonly type: string = ActionTypes.REFRESH_AUTH_STATE;
  payload = {
    user: {},
    authStatus: false
  };
  constructor() {
    const userAuth = AuthFacade.getUser();
    const token = AuthFacade.getToken();
    const authStatusAuth = AuthFacade.getAuthStatus();
    this.payload.user = new User(userAuth);
    this.payload.authStatus = authStatusAuth;
  }
}
@Injectable()
export class UpdateAuthUser implements Action {
  readonly type: string = ActionTypes.UPDATE_AUTH_USER;
  constructor(public payload: object) {
    // console.log(ActionTypes.UPDATE_AUTH_USER, this.payload);
    // let user = AuthFacade.getUser();
    // Object.keys(this.payload).map(prop => {
    //   if (typeof this.payload[prop] !== 'undefined') {
    //     switch (prop) {
    //       case 'schools':
    //         if (!user[prop]) {
    //           user[prop] = [];
    //         }
    //         if (Array.isArray(this.payload[prop])) {
    //           user[prop] = this.payload[prop];
    //         } else {
    //           user[prop].push(this.payload[prop]);
    //         }
    //         break;
    //       case 'permissions':
    //         break;
    //       default:
    //         user[prop] = this.payload[prop];
    //         break;
    //     }
    //   }
    // });
    // AuthFacade.setUser(user);
  }
}

export class ToggleUsedAuthSocial implements Action {
  readonly type: string = ActionTypes.TOOGLE_AUTH_USED;
  constructor(public payload: {provider: string} ) {}
}

export class SignOut implements Action {
  readonly type: string = ActionTypes.SIGN_OUT;
  constructor(
    private authFacade: AuthFacade,
    redirect = true
  ) {
      console.log(ActionTypes.SIGN_OUT);
      authFacade.endSession(redirect);
      // const refr = new RefreshAuthState();
  }
}

export class AddUserToFamily implements Action {
  readonly type: string = ActionTypes.ADD_USER_TO_FAMILY;
  constructor(public payload: {user: UserInterface}) {
  }
}

/**
 * Actions type.
 * @type {Actions}
 */
export type Actions
  =
  AuthenticateAction
  | AuthenticatedAction
  | AuthenticatedErrorAction
  | AuthenticatedSuccessAction
  | AuthenticationErrorAction
  | AuthenticationSuccessAction
  | SignUpAction
  | SignUpErrorAction
  | SignUpSuccessAction
  | RefreshAuthState
  | UpdateAuthUser
  | ToggleUsedAuthSocial
  | SignOut
  | AddUserToFamily;
