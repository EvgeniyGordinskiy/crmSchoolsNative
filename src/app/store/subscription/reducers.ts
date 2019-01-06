import { Actions, ActionTypes } from './actions';
import * as fromApp from '../app.reducers';
import {ActionInterface} from '../../interfaces/action.interface';
import {Subscription} from '../../models/subscription';

export interface SubscriptionState extends fromApp.AppState {
  addedSubscription: Subscription;
  subscriptions: Subscription[];
  lastAction: '';
}

/**
 * The state.
 * @interface State
 */
export interface State {
  addedSubscription: Subscription;
  subscriptions: Subscription[];
  lastAction: '';
}

/**
 * The initial state.
 */
const initialState: State = {
  addedSubscription: null,
  subscriptions: [],
  lastAction: ''
};

/**
 * The reducer function.
 * @function reducer
 * @param {State} state Current state
 * @param {Actions} action Incoming action
 */
export function reducer(state: any = initialState, action: ActionInterface) {
  switch (action.type) {
    case ActionTypes.ADD_SUBSCRIPTION:
      if (action.payload) {
        state.addedSubscription = action.payload;
      }
      console.log(state, ActionTypes.ADD_SUBSCRIPTION);
      state.lastAction = 'ADD_SUBSCRIPTION';
      return state;
    case ActionTypes.SET_SUBSCRIPTIONS:
      if (action.payload) {
        state.subscriptions = action.payload;
      }
      console.log(state, ActionTypes.SET_SUBSCRIPTIONS);
      state.lastAction = 'SET_SUBSCRIPTIONS';
      return state;
    case ActionTypes.UPDATE_SUBSCRIPTION:
      if (action.payload) {
        state.subscriptions.map ((subscr, i) => {
          if (subscr.id === action.payload.id) {
            state.subscriptions[i] = action.payload;
          }
        });
      }
      console.log(state, ActionTypes.UPDATE_SUBSCRIPTION);
      state.lastAction = 'UPDATE_SUBSCRIPTION';
      return state;
    default:
      console.log(state, 'default');
      state.lastAction = 'default';
      return state;
  }
}

