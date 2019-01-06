import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {CreateProgram} from '../../interfaces/requests/create-program';
import {User} from '../../models/user';
import {Store} from '@ngrx/store';
import * as AuthReducer from '../../store/auth/reducers';
// import {ProgramInterface} from '../../interfaces/program.interface';
import {StartSpinner} from '../../store/spinner/actions';
import * as SpinnerReducer from '../../store/spinner/reducers';
import {Observable} from 'rxjs';
import {AuthFacade} from '../../facades/auth/authFacade';
import {OnDestroy} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgramService implements OnDestroy{
  subscribes = [];
  user: User;

  constructor(
    private httpClient: HttpClient,
    private authStore: Store<AuthReducer.AuthState>,
    private spinnerStore: Store<SpinnerReducer.SpinnerState>
  ) {
    this.subscribes.push(this.authStore.subscribe(
      (val) => {
        const user = AuthFacade.getUser();
        console.log(user);
        if (user) {
          this.user = user;
        }
      }
    ));
  }
  ngOnDestroy() {
    this.unsubscribe();
  }
  create(body) {
    if (this.user.activeSchool) {
      const school_id = this.user.activeSchool;
      return this.httpClient.post(school_id + '/program' , body);
    }
    return new Observable();
  }
  deleteProgram(program_id, force) {
    if (this.user.activeSchool) {
      const school_id = this.user.activeSchool;
      const url = school_id + '/program/' + program_id;
      return this.httpClient.delete(force ? url + '/f': url );
    }
    return new Observable();
  }
  edit(body) {
    if (this.user.activeSchool) {
      const school_id = this.user.activeSchool;
      return this.httpClient.put(school_id + '/program' , body);
    }
    return new Observable();
  }
  getAll(user = null, ids = []) {
   this.user = user ? user : this.user;
    if (this.user.activeSchool) {
      this.spinnerStore.dispatch(new StartSpinner());
      const school_id = this.user.activeSchool;
      return this.httpClient.get(school_id + '/program/');
    }
    let idsS = '';
    if (ids.length > 0) {
      idsS += '?ids=' + ids.join(',');
      return this.httpClient.get('program' + idsS);
    }
    return new Observable();
  }
  getProgamByIds(ids, trial, user_id) {
    let idsS = '';
    if (ids.length > 0) {
      idsS += '?ids=' + ids.join(',');
      if (trial && user_id) {
        idsS += '&trial=' + trial + '&user_id=' + user_id;
      }
      return this.httpClient.get('program' + idsS);
    }
    return new Observable();
  }
  getProgram(program_id) {
      this.spinnerStore.dispatch(new StartSpinner());
      return this.httpClient.get('programInfo/' + program_id);
  }

  getUsersPrograms() {
    return this.httpClient.get('program/programUser');
  }
  getSchoolPrograms(program_id) {
    return this.httpClient.get('program/programClass/' + program_id);
  }
  getProgramsByCurriculum(curriculum_id) {
    return this.httpClient.get('program/programCurriculum/' + curriculum_id);
  }
  setProgramUser( user_id: number, program_id: number) {
    return this.httpClient.post('program/programUser', {program_id: program_id, user_id: user_id});
  }

  addUser(body) {
      return this.httpClient.post( 'program/user' , body);
  }
  deleteUser(body: {user_id: number, program_id: number}) {
      return this.httpClient.delete('program/user/'+body.user_id+'/'+body.program_id);
  }
  toggleUserInTheProgram(body, deleteUser = false) {
    if (deleteUser === true) {
      return this.deleteUser(body);
    } else {
      return this.addUser(body);
    }
  }
  inviteUser(body) {
    if (this.user.activeSchool) {
      const school_id = this.user.activeSchool;
      return this.httpClient.post(school_id + '/program/invite' , body);
    }
    return new Observable();
  }
  search(value: string) {
    return this.httpClient.get('program/search?value=' + value);
  }
  unsubscribe() {
    this.subscribes.map( subscr => {
      subscr.unsubscribe();
    });
  }
}
