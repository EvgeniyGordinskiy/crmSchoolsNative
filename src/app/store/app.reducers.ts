
import * as fromAuth from './auth/reducers';
import * as fromSpinner from './spinner/reducers';
import * as fromProgram from './program/reducers';
import * as fromStudent from './student/reducers';
import * as fromTeacher from './teacher/reducers';
import * as fromSubscription from './subscription/reducers';

export interface AppState {
  auth: fromAuth.State;
  spinner: fromSpinner.State;
  program: fromProgram.State;
  student: fromStudent.State;
  teacher: fromTeacher.State;
  subscription: fromSubscription.State;
}

export const reducers = {
  auth: fromAuth.reducer,
  spinner: fromSpinner.reducer,
  program: fromProgram.reducer,
  student: fromStudent.reducer,
  teacher: fromTeacher.reducer,
  subscription: fromSubscription.reducer,
};
