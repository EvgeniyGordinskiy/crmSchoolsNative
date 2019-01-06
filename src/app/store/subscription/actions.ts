import {ActionInterface  as Action} from '../../interfaces/action.interface';

// import type function
import { uniqueType } from '../../utils/uniqueType';
import {Subscription} from '../../models/subscription';

export const ActionTypes = {
  ADD_SUBSCRIPTION: uniqueType('ADD_SUBSCRIPTION'),
  SET_SUBSCRIPTIONS: uniqueType('SET_SUBSCRIPTIONS'),
  UPDATE_SUBSCRIPTION: uniqueType('UPDATE_SUBSCRIPTION'),
};
export class AddSubscription implements Action {
  readonly type: string = ActionTypes.ADD_SUBSCRIPTION;
  constructor(public payload: Subscription) {}
}

export class SetSubscriptions implements Action {
  readonly type: string = ActionTypes.SET_SUBSCRIPTIONS;
  constructor(public payload: Subscription[]) {}
}

export class UpdateSubscription implements Action {
  readonly type: string = ActionTypes.UPDATE_SUBSCRIPTION;
  constructor(public payload: Subscription) {}
}


export type Actions
  =
  AddSubscription|
  SetSubscriptions|
  UpdateSubscription;
