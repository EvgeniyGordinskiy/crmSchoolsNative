import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {StartSpinner} from '../../store/spinner/actions';
import {AuthFacade} from '../../facades/auth/authFacade';
import {User} from '../../models/user';
import * as AuthReducer from '../../store/auth/reducers';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as SpinnerReducer from '../../store/spinner/reducers';

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {
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

  getAll(parent_id = null, source, curriculumIds = [], all = false, programIds = []) {
    this.spinnerStore.dispatch(new StartSpinner());
    let q = '?';
    if (curriculumIds.length > 0) {
      q += 'ids=' + curriculumIds.join(',');
    }
    if (programIds.length > 0) {
      if (curriculumIds.length > 0) {
        q += '&';
      }
        q += 'program_ids=' + programIds.join(',');
    }
    if (all) {
      if (q.length > 0) {
        q += '&';
      }
      q += 'info=1';
    }
    if (source === 'curriculum') {
      return this.httpClient.get('curriculum/' + (parent_id ? parent_id : '' + q));
    }
    if (source === 'lesson') {
      return this.httpClient.get('lesson/' + (parent_id ? parent_id : '' + q));
    }
    if (source === 'block') {
      return this.httpClient.get('block/' + (parent_id ? parent_id : '' + q));
    }
  }
  create(body, source, parent_id = null) {
    if (this.user.activeSchool) {
      this.spinnerStore.dispatch(new StartSpinner());
      const school_id = this.user.activeSchool;
      if (source === 'curriculum') {
        body['program_id'] = parent_id;
        return this.httpClient.post(school_id + '/curriculum', body);
      }
      if (source === 'lesson') {
        body['curriculum_id'] = parent_id;
        return this.httpClient.post(school_id + '/lesson', body);
      }
      if (source === 'block') {
        body['lesson_id'] = parent_id;
        return this.httpClient.post(school_id + '/block', body);
      }

    }
    return new Observable();
  }
  changeOrder(body) {
    if (this.user.activeSchool) {
      const school_id = this.user.activeSchool;
      return this.httpClient.post(school_id + '/lesson/order', body);
    }
    return new Observable();
  }
  deleteItem(body) {
    if (this.user.activeSchool) {
      const school_id = this.user.activeSchool;
      return this.httpClient.post(school_id + '/curriculum/delete', body);
    }
    return new Observable();
  }
  addToProgram(body) {
    if (this.user.activeSchool) {
      const school_id = this.user.activeSchool;
      return this.httpClient.post(school_id + '/curriculum/add', body);
    }
    return new Observable();
  }
  setTime(body) {
      if (this.user.activeSchool) {
        const school_id = this.user.activeSchool;
        return this.httpClient.post(school_id + '/curriculum/setTime', body);
      }
      return new Observable();
  }
}
