import {Action} from '@ngrx/store';

export interface ActionInterface extends Action {
  type: string;
  payload?: any;
}
