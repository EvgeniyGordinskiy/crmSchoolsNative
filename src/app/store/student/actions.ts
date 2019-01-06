import {ActionInterface  as Action} from '../../interfaces/action.interface';

// import type function
import { uniqueType } from '../../utils/uniqueType';
import {User} from '../../models/user';

export const ActionTypes = {
  ADD_STUDENT: uniqueType('ADD_STUDENT'),
  ALL_STUDENTS: uniqueType('ALL_STUDENTS'),
  SET_STUDENTS: uniqueType('SET_STUDENTS'),
  CLOSE_MODAL: uniqueType('CLOSE_MODAL'),
};

export class SetStudents implements Action {
  readonly type: string = ActionTypes.SET_STUDENTS;
  constructor(public payload: User[]) {}
}

export class AddStudent implements Action {
  readonly type: string = ActionTypes.ADD_STUDENT;
  constructor(public payload: User) {}
}

export class AllStudents implements Action {
  readonly type: string = ActionTypes.ALL_STUDENTS;
  constructor() {}
}

export class CloseModal implements Action {
  readonly type: string = ActionTypes.CLOSE_MODAL;
  constructor() {}
}


export type Actions
  =
  AddStudent
  | AllStudents
  | SetStudents
  | CloseModal
