import { Actions, ActionTypes } from './actions';
import * as fromApp from '../app.reducers';
import {ActionInterface} from '../../interfaces/action.interface';
import {Program} from '../../models/program';
import {Curriculum} from '../../models/curriculum';

export interface ProgramState extends fromApp.AppState {
  program: State;
  lastAction: string;
  currentCurriculum: Curriculum
}

/**
 * The state.
 * @interface State
 */
export interface State {
  programs: Program[];
  lastAction: string;
  currentCurriculum: Curriculum
}

/**
 * The initial state.
 */
const initialState: State = {
  programs: [],
  lastAction: '',
  currentCurriculum: null
};

/**
 * The reducer function.
 * @function reducer
 * @param {State} state Current state
 * @param {Actions} action Incoming action
 */
export function reducer(state: any = initialState, action: ActionInterface) {
  switch (action.type) {
    case ActionTypes.ADD_PROGRAM:
      if (action.payload) {
        state.programs.push(action.payload);
        state.lastAction = ActionTypes.ADD_PROGRAM;
      }
      console.log(state, ActionTypes.ADD_PROGRAM);
      return state;
    case ActionTypes.UPDATE_PROGRAM:
      if (action.payload) {
        Object.keys(state.programs).map( index => {
          if (state.programs[index].id === action.payload.id) {
            state.programs[index] = action.payload;
          }
        });
        state.lastAction = ActionTypes.UPDATE_PROGRAM;
      }
      console.log(state, ActionTypes.UPDATE_PROGRAM);
      return state;
    case ActionTypes.DELETE_PROGRAM:
      if (action.payload) {
        Object.keys(state.programs).map( index => {
          if (state.programs[index] && state.programs[index].id === action.payload) {
            state.programs.splice(index, 1);
          }
        });
        state.lastAction = ActionTypes.DELETE_PROGRAM;
      }
      console.log(state, ActionTypes.DELETE_PROGRAM);
      return state;
    case ActionTypes.ADD_SUBSCRIPTION_TO_PROGRAM:
      if (action.payload) {
        // state.programs.map( item => {
        //   let found = false;
        //   if (action.payload.subscription.id) {
        //     item.subscriptions.map( (subscr, i) => {
        //       if (subscr.id === action.payload.subscription.id) {
        //         item.subscriptions[i] = action.payload.subscription;
        //         found = true;
        //       }
        //     });
        //   }
        //   if (found === false && item.id === action.payload.program_id) {
        //     item.subscriptions.push(action.payload.subscription);
        //   }
        // });
      }
     state.lastAction = ActionTypes.ADD_SUBSCRIPTION_TO_PROGRAM;
     console.log(state, ActionTypes.ADD_SUBSCRIPTION_TO_PROGRAM);
     return state;
     case ActionTypes.SET_CURRICULUM:
      if (action.payload) {
        let found = false;
        state.programs.map( (item, y) => {
          if (item.id === action.payload.program_id) {
            item.curriculum.map((curr, i) => {
              if (curr.id === action.payload.curriculum.id) {
                found = true;
                if (action.payload.deleted === true) {
                  state.programs[y].curriculum.splice(i, 1);
                }
              }
            });
            if (found === false) {
              item.curriculum.push(action.payload.curriculum);
            }
          }
        });
      }
     state.lastAction = ActionTypes.SET_CURRICULUM;
     console.log(state, ActionTypes.SET_CURRICULUM);
     return state;
     case ActionTypes.UPDATE_CURRICULUM:
     state.lastAction = ActionTypes.UPDATE_CURRICULUM;
     state.currentCurriculum = action.payload.curriculum;
     if (action.payload.program_id) {
       state.programs.map((item, i) => {
         if (item.id === action.payload.program_id) {
           item.curriculum.map((curr, y) => {
             if (curr.id === action.payload.curriculum) {
               state.programs[i].curriculum[y] = action.payload.curriculum;
             }
           });
         }
       });
     }
     console.log(state, ActionTypes.UPDATE_CURRICULUM);
     return state;
     case ActionTypes.SET_SUBSCRIPTION_TO_PROGRAM:
      if (action.payload) {
        state.programs.map( item => {
          if (item.id === action.payload.program_id) {
            item.subscriptions = action.payload.subscriptions;
          }
        });
      }
     state.lastAction = ActionTypes.SET_SUBSCRIPTION_TO_PROGRAM;
     console.log(state, ActionTypes.SET_SUBSCRIPTION_TO_PROGRAM);
     return state;
    case ActionTypes.ALL_PROGRAMS:
      console.log(state, ActionTypes.ALL_PROGRAMS);
      return state;
    case ActionTypes.REMOVE_ALL_PROGRAMS:
      console.log(state, ActionTypes.REMOVE_ALL_PROGRAMS);
      state.programs = [];
      return state;
    case ActionTypes.CLOSE_POPUP:
      console.log(state, ActionTypes.CLOSE_POPUP);
      state.lastAction = ActionTypes.CLOSE_POPUP;
      return state;
    case ActionTypes.SET_CURRICULUM_TIME:
      state.programs.map( (pr, i) => {
        if (pr.id === action.payload.program.id) {
          switch (action.payload.part) {
            case 'start' : {
              state.programs[i].start_curriculum = action.payload.dateTime;
              break;
            }
            case 'end' : {
              state.programs[i].end_curriculum = action.payload.dateTime;
              break;
            }
          }
        }
      });
      console.log(state, ActionTypes.SET_CURRICULUM_TIME);
      state.lastAction = ActionTypes.SET_CURRICULUM_TIME;
      return state;
    case ActionTypes.SET_PROGRAMS:
      console.log(state, ActionTypes.SET_PROGRAMS);
      state.lastAction = ActionTypes.SET_PROGRAMS;
      state.programs = action.payload;
      return state;
    default:
      console.log(state, 'default');
      state.lastAction = 'default';
      return state;
  }
}

