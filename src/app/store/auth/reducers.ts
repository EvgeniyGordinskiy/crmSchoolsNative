import { Actions, ActionTypes } from './actions';
import * as fromApp from '../app.reducers';

import { User } from '../../models/user';
import {ActionInterface} from '../../interfaces/action.interface';
import {AuthFacade} from '../../facades/auth/authFacade';
// import {InitialState} from '@node_modules/@ngrx/store/src/models';

export interface AuthState extends fromApp.AppState {
  authenticated: false;
  error?: string;
  user?: User;
}

/**
 * The state.
 * @interface State
 */
export interface State {
  authenticated: boolean;
  error?: string;
  user?: User;
  lastAction: string;
}

/**
 * The initial state.
 */
const initialState: State = {
  authenticated: false,
  user: new User(),
  lastAction: ''
};

/**
 * The reducer function.
 * @function reducer
 * @param {State} state Current state
 * @param {Actions} action Incoming action
 */
export function reducer(state: any = initialState, action: ActionInterface) {
  console.log(action);
  switch (action.type) {
    case ActionTypes.AUTHENTICATE:
      console.log(state, 'AUTHENTICATE');
      return {
        ...state,
        error: false,
      };

    case ActionTypes.AUTHENTICATED_ERROR:
      return {
        ...state,
        authenticated: false,
        error: action.payload.error.message,
      };

    case ActionTypes.AUTHENTICATED_SUCCESS:
      state.authenticated = action.payload.authenticated;
      state.user = action.payload.user;
      console.log(state, 'AUTHENTICATED_SUCCESS');
      return state;

    case ActionTypes.AUTHENTICATE_ERROR:
    case ActionTypes.SIGN_UP_ERROR:
      return {
        ...state,
        authenticated: false,
        error: action.payload.error.message,
        loading: false
      };
    //
    // case ActionTypes.AUTHENTICATE_SUCCESS:
    // case ActionTypes.SIGN_UP_SUCCESS:
    //   const user: User = action.payload.user;
    //   // verify user is not null
    //   if (user === null) {
    //     return state;
    //   }
    //   console.log(state, 'SIGN_UP_SUCCESS, AUTHENTICATE_SUCCESS');
    //
    //   return {
    //     ...state,
    //     authenticated: true,
    //     error: undefined,
    //     loading: false,
    //     user: user
    //   };
    case ActionTypes.UPDATE_AUTH_USER:
        const properties = action.payload;
        let lastAction = 'UPDATE_AUTH_USER';
        console.log(state, 'before UPDATE_AUTH_USER');
        if (!state.user) {
          state.user = new User();
        }
        if (properties.yearAttendanceFromApi &&
          (!state.user.yearAttendanceFromApi ||
            properties.yearAttendanceFromApi.length !== state.user.yearAttendanceFromApi.length)
        ) {
          lastAction = 'UPDATE_AUTH_USER_ATTENDANCE';
        }
        if (properties.not_read_messages !== state.user.not_read_messages) {
          lastAction = 'UPDATE_NOT_READ_MESSAGES';
        }
          Object.keys(properties).map(prop => {
            if (typeof properties[prop] !== 'undefined') {
              switch (prop) {
                case 'schools':
                  if (!state.user[prop]) {
                    state.user[prop] = [];
                  }
                  if (Array.isArray(properties[prop])) {
                    state.user[prop] = properties[prop];
                  } else {
                    state.user[prop].push(properties[prop]);
                  }
                  break;
                case 'permissions':
                  break;
                default:
                  state.user[prop] = properties[prop];
                  break;
              }
            }
          });
        state.lastAction = lastAction;
        AuthFacade.setUser(state.user);
        console.log(state, lastAction);
      return state;

    case ActionTypes.SIGN_OUT:
      console.log({
        authenticated: false,
        user: new User(),
        lastAction: ''
      }, 'SIGN_OUT');
      return state;

    case ActionTypes.SIGN_UP:
      return {
        ...state,
        authenticated: false,
        error: undefined,
        loading: true
      };

      case ActionTypes.REFRESH_AUTH_STATE:
        state.authenticated = action.payload.authStatus;
        state.user = action.payload.user;
        console.log(state, 'REFRESH_AUTH_STATE');

        return state;

      case ActionTypes.TOOGLE_AUTH_USED:
        state.user.usedAuthSocial =  action.payload.provider;
        AuthFacade.setUser(state.user);
        console.log(state, 'TOOGLE_AUTH_USED');
        return state;

      case ActionTypes.ADD_USER_TO_FAMILY:
        if (action.payload.user) {
          let userFound = false;
          state.user.family.map(item => {
            if (item.email === action.payload.user.email) userFound = true;
          });
          if (userFound === false) {
            state.user.family.push(action.payload.user);
            AuthFacade.setUser(state.user);
          }
        }
        state.lastAction = 'ADD_USER_TO_FAMILY';
        console.log(state, 'ADD_USER_TO_FAMILY');
        return state;

    default:
      // console.log(state, 'default');
      state.lastAction = 'default';
      return state;
  }
}

/**
 * Returns true if the user is authenticated.
 * @function isAuthenticated
 * @param {State} state
 * @returns {boolean}
 */
export const isAuthenticated = (state: AuthState) => console.log(state);

/**
 * Return the users state
 * @function getAuthenticatedUser
 * @param {State} state
 * @returns {User}
 */
export const getAuthenticatedUser = (state: AuthState) => state.user;

/**
 * Returns the authentication error.
 * @function getAuthenticationError
 * @param {State} state
 * @returns {Error}
 */
export const getAuthenticationError = (state: AuthState) => state.error;

/**
 * Returns the sign out error.
 * @function getSignOutError
 * @param {State} state
 * @returns {Error}
 */
export const getSignOutError = (state: AuthState) => state.error;

/**
 * Returns the sign up error.
 * @function getSignUpError
 * @param {State} state
 * @returns {Error}
 */
export const getSignUpError = (state: AuthState) => state.error;
