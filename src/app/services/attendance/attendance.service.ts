import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  chechIn(body: {user_id: number, program_id: number, lesson_id: number, schedule_id: number}) {
    return  this.httpClient.post('attendance/checkIn', body);
  }

  getStudentAttendences(body: {user_id:number, period: string}) {
    return  this.httpClient.get('attendance/' + body.user_id + '/' + body.period);
  }

  getYearStatistic(body: {program_id?:number, curriculum_id?: number, user_id?: number}) {
    return  this.httpClient.post('attendance/yearStatistic', body);
  }
  getStudentConversation(program_id) {
    return this.httpClient.get('attendance/conversation/'+program_id);
  }
}
