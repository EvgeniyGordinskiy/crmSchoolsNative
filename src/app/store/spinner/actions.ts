import { Action } from '@ngrx/store';

// import type function
import { uniqueType } from '../../utils/uniqueType';

export const ActionTypes = {
  START_SPINNER: uniqueType('RUN_SPINNER'),
  STOP_SPINNER: uniqueType('STOP_SPINNER'),
};

/**
 * Runs spinner.
 * @classes RunSpinner
 * @implements {Action}
 */
export class StartSpinner implements Action {
  readonly type: string = ActionTypes.START_SPINNER;
  constructor() {}
}

/**
 * Disables spinner.
 * @classes StopSpinner
 * @implements {Action}
 */
export class StopSpinner implements Action {
  readonly type: string = ActionTypes.STOP_SPINNER;

  constructor() {}
}

/**
 * Actions type.
 * @type {Actions}
 */
export type Actions
  =
  StartSpinner
  | StopSpinner;
