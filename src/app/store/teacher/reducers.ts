import { Actions, ActionTypes } from './actions';
import * as fromApp from '../app.reducers';
import {ActionInterface} from '../../interfaces/action.interface';
import {User} from '../../models/user';

export interface TeacherState extends fromApp.AppState {
  teachers: User[];
  lastAction: string
}

/**
 * The state.
 * @interface State
 */
export interface State {
  teachers: User[];
  lastAction: string
}

/**
 * The initial state.
 */
const initialState: State = {
  teachers: [],
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
    case ActionTypes.ADD_TEACHER:
      if (action.payload) {
        let found = false;
        state.teachers.map( item => {
          if (item.id === action.payload.id) {
            found = true;
          }
        });
        if (found === false) {
          state.teachers.push(action.payload);
        }
        state.lastAction = ActionTypes.ADD_TEACHER;
      }
      console.log(state, ActionTypes.ADD_TEACHER);
      return state;
    case ActionTypes.ALL_TEACHERS:
      console.log(state, ActionTypes.ALL_TEACHERS);
      return state;
    case ActionTypes.UPDATE_TEACHER:
      const properties = action.payload;
      if (properties.id) {
        state.teachers.map( (teacher, i) => {
          if (teacher.id === properties.id) {
            Object.keys(properties).map(prop => {
              if (typeof properties[prop] !== 'undefined') {
                switch (prop) {
                  case 'permissions':
                    break;
                  default:
                    state.teachers[i][prop] = properties[prop];
                    break;
                }
              }
            });
          }
        });
        return state;
      }
      console.log(state, ActionTypes.UPDATE_TEACHER);
      return state;
     case ActionTypes.SET_TEACHERS:
      console.log(state, ActionTypes.SET_TEACHERS);
       if (action.payload) {
         state.lastAction = ActionTypes.SET_TEACHERS;
         state.teachers = action.payload;
       }
      return state;
    default:
      // console.log(state, 'default');
      state.lastAction = 'default';
      return state;
  }
}

