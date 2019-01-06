import { Actions, ActionTypes } from './actions';
import * as fromApp from '../../store/app.reducers';

export interface SpinnerState extends fromApp.AppState {
  spinner: State;
}

/**
 * The state.
 * @interface State
 */
export interface State {
  running: boolean;
}

/**
 * The initial state.
 */
const initialState: State = {
  running: false,
};

/**
 * The reducer function.
 * @function reducer
 * @param {State} state Current state
 * @param {Actions} action Incoming action
 */
export function reducer(state: any = initialState, action: Actions) {
  switch (action.type) {
    case ActionTypes.START_SPINNER:
      return {
        running: true
      };

    case ActionTypes.STOP_SPINNER:
      return {
        running: false,
      };
  }
}

/**
 * Returns spinners status.
 * @function getSpinnerStatus
 * @param {State} state
 * @returns {boolean}
 */
export const getSpinnerStatus = (state: State) => state.running;
