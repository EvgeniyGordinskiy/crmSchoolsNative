import {ActionInterface  as Action} from '../../interfaces/action.interface';

// import type function
import { uniqueType } from '../../utils/uniqueType';
import {User} from '../../models/user';

export const ActionTypes = {
  ADD_TEACHER: uniqueType('ADD_TEACHER'),
  ALL_TEACHERS: uniqueType('ALL_TEACHERS'),
  SET_TEACHERS: uniqueType('SET_TEACHERS'),
  UPDATE_TEACHER: uniqueType('UPDATE_TEACHER'),
};

export class SetTeachers implements Action {
  readonly type: string = ActionTypes.SET_TEACHERS;
  constructor(public payload: User[]) {}
}

export class AddTeacher implements Action {
  readonly type: string = ActionTypes.ADD_TEACHER;
  constructor(public payload: User) {}
}

export class AllTeachers implements Action {
  readonly type: string = ActionTypes.ALL_TEACHERS;
  constructor() {}
}

export class UpdateTeacher implements Action {
  readonly type: string = ActionTypes.UPDATE_TEACHER;
  constructor(public payload: object) {}
}


export type Actions
  =
  AddTeacher
  | AllTeachers
  | SetTeachers
