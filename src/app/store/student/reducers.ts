import { Actions, ActionTypes } from './actions';
import * as fromApp from '../../store/app.reducers';
import {ActionInterface} from '../../interfaces/action.interface';
import {User} from '../../models/user';

export interface StudentState extends fromApp.AppState {
  students: User[];
  lastAction: string
}

/**
 * The state.
 * @interface State
 */
export interface State {
  students: User[];
  lastAction: string
}

/**
 * The initial state.
 */
const initialState: State = {
  students: [],
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
    case ActionTypes.ADD_STUDENT:
      if (action.payload) {
        let userFound = false;
        state.students.map(item => {
          if (item.email === action.payload.email) userFound = true;
        });
        if (userFound === false) {
          state.students.push(action.payload);
          state.lastAction = ActionTypes.ADD_STUDENT;
        }
      }
      console.log(state, ActionTypes.ADD_STUDENT);
      return state;
    case ActionTypes.ALL_STUDENTS:
      console.log(state, ActionTypes.ALL_STUDENTS);
      return state;
     case ActionTypes.SET_STUDENTS:
       if (action.payload) {
         const usersEmails = [];
         state.students.map(item => {
           usersEmails.push(item.email);
         });
         if (Array.isArray(action.payload)) {
           action.payload.map(newStudent => {
             if (!usersEmails.includes(newStudent.email)) {
               state.students.push(newStudent);
             }
           })
         }
         state.lastAction = ActionTypes.SET_STUDENTS;
       }
       console.log(state, ActionTypes.SET_STUDENTS);
      return state;
     case ActionTypes.CLOSE_MODAL:
      console.log(state, ActionTypes.CLOSE_MODAL);
       state.lastAction = 'CLOSE_MODAL';
       return state;
    default:
      // console.log(state, 'default');
      state.lastAction = 'default';
      return state;
  }
}

