import {ActionInterface  as Action} from '../../interfaces/action.interface';

// import type function
import { uniqueType } from '../../utils/uniqueType';
import {Program} from '../../models/program';
import {Subscription} from '../../models/subscription';
import {Curriculum} from '../../models/curriculum';
import {Schedule} from '../../models/schedule';

export const ActionTypes = {
  ADD_PROGRAM: uniqueType('ADD_PROGRAM'),
  UPDATE_PROGRAM: uniqueType('UPDATE_PROGRAM'),
  DELETE_PROGRAM: uniqueType('DELETE_PROGRAM'),
  ADD_SUBSCRIPTION_TO_PROGRAM: uniqueType('ADD_SUBSCRIPTION_TO_PROGRAM'),
  SET_SUBSCRIPTION_TO_PROGRAM: uniqueType('SET_SUBSCRIPTION_TO_PROGRAM'),
  ALL_PROGRAMS: uniqueType('ALL_PROGRAMS'),
  REMOVE_ALL_PROGRAMS: uniqueType('REMOVE_ALL_PROGRAMS'),
  SET_PROGRAMS: uniqueType('SET_PROGRAMS'),
  SET_CURRICULUM: uniqueType('SET_CURRICULUM'),
  UPDATE_CURRICULUM: uniqueType('UPDATE_CURRICULUM'),
  CLOSE_POPUP: uniqueType('CLOSE_POPUP'),
  SET_CURRICULUM_TIME: uniqueType('SET_CURRICULUM_TIME'),
};


export class AddProgram implements Action {
  readonly type: string = ActionTypes.ADD_PROGRAM;
  constructor(public payload: Program) {}
}

export class UpdateProgram implements Action {
  readonly type: string = ActionTypes.UPDATE_PROGRAM;
  constructor(public payload: Program) {}
}

export class DeleteProgram implements Action {
  readonly type: string = ActionTypes.DELETE_PROGRAM;
  constructor(public payload: number) {}
}

export class AddSubscriptionToProgram implements Action {
  readonly type: string = ActionTypes.ADD_SUBSCRIPTION_TO_PROGRAM;
  constructor(public payload: {subscription: Subscription, program_id: number}) {}
}
export class AddCurriculumToProgram implements Action {
  readonly type: string = ActionTypes.SET_CURRICULUM;
  constructor(public payload: {curriculum: Curriculum, program_id: number, deleted: boolean}) {}
}
export class UpdateCurriculum implements Action {
  readonly type: string = ActionTypes.UPDATE_CURRICULUM;
  constructor(public payload: {curriculum: Curriculum, program_id: number}) {}
}
export class SetSubscriptionToProgram implements Action {
  readonly type: string = ActionTypes.SET_SUBSCRIPTION_TO_PROGRAM;
  constructor(public payload: {subscriptions: Subscription[], program_id: number}) {}
}

export class SetPrograms implements Action {
  readonly type: string = ActionTypes.SET_PROGRAMS;
  constructor(public payload: Program[]) {
    console.log(ActionTypes.SET_PROGRAMS, payload);
  }
}

export class AllPrograms implements Action {
  readonly type: string = ActionTypes.ALL_PROGRAMS;
  constructor() {}
}

export class RemoveAllPrograms implements Action {
  readonly type: string = ActionTypes.REMOVE_ALL_PROGRAMS;
  constructor() {}
}

export class ClosePopup implements Action {
  readonly type: string = ActionTypes.CLOSE_POPUP;
  constructor() {}
}

export class SetCurriculumTime implements Action {
  readonly type: string = ActionTypes.SET_CURRICULUM_TIME;
  constructor(public payload: {part: string, dateTime: string, program: Program}) {}
}

/**
 * Actions type.
 * @type {Actions}
 */
export type Actions
  =
  AddProgram
  | AllPrograms
  | UpdateProgram
  | AddSubscriptionToProgram
  | AddCurriculumToProgram
  | SetSubscriptionToProgram
  | ClosePopup
  | SetCurriculumTime
  | DeleteProgram
  | RemoveAllPrograms;
