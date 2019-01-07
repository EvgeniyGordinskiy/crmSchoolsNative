import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../models/user';
import {ProgramService} from '../../../../services/program/program.service';
import {Program} from '../../../../models/program';
import {PaymentService} from '../../../../services/payment/payment.service';
// import {Router} from '@node_modules/@angular/router';
import {Subject} from 'rxjs/internal/Subject';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import * as moment from 'moment';
import * as AuthReducer from '../../../../store/auth/reducers';
import {Store} from '@ngrx/store';
import {AttendanceService} from '../../../../services/attendance/attendance.service';
import {Attendance} from '../../../../models/attendance';
import {UpdateAuthUser} from '../../../../store/auth/actions';
import {Curriculum} from '../../../../models/curriculum';
import {Schedule} from '../../../../models/schedule';
import {Class} from '../../../../models/class';
import { fromResource }  from "tns-core-modules/image-source";
// import {MatDialog, Sort} from '@node_modules/@angular/material';
// import {ProgramViewComponent} from '@components/program-view/program-view.component';
// import {AttendanceOverviewComponent} from '@components/attendance-overview/attendance-overview.component';
// import {ViewMonthCurriculumComponent} from '@components/view-month-curriculum/view-month-curriculum.component';
import {CurriculumService} from '../../../../services/curriculum/curriculum.service';
import {Lesson} from '../../../../models/lesson';
import {Observable} from 'rxjs';
import * as ProgramReducer from '../../../../store/program/reducers';
import {SetPrograms, UpdateProgram} from '../../../../store/program/actions';
import {TNSFontIconService} from "nativescript-ng2-fonticon";
import {Label} from "tns-core-modules/ui/label";
import {Page} from "tns-core-modules/ui/page";
import {action, ActionOptions} from "tns-core-modules/ui/dialogs";
import {ScheduleFacade} from "~/app/facades/schedule/scheduleFacade";
// import {ProgramPageComponent} from '@pages/layout/program/program-page/program-page.component';

@Component({
  selector: 'DashboardStudent',
  templateUrl: './dashboard-student.component.html',
  moduleId: module.id,
  styleUrls: ['./dashboard-student.component.css']
})
export class DashboardStudentComponent implements OnInit {
  @Input() user: User;
  programs: Program[] = [];
  // programsIdWithSubscriptionSubject: BehaviorSubject<{program_id:number, subscription_id: number}> = new BehaviorSubject<{program_id: number, subscription_id: number}>(null);
  programsIdWithSubscription: {[program_id: number]: number[]} = {};
  programsIdWithSubscriptionLength = 0;
  userSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  moveAttendencesCarousel: Subject<string> = new BehaviorSubject(null);
  onTodaySubject: Subject<string> = new BehaviorSubject(null);
  onLeftSubject: Subject<string> = new BehaviorSubject(null);
  onRightSubject: Subject<string> = new BehaviorSubject(null);
  insertingSchedule: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentMonth = moment();
  startOfWeek = moment().startOf('isoWeek');
  endOfWeek = moment().endOf('isoWeek');
  week = [];
  selectedAttendance: BehaviorSubject<{program_id: number, curriculum_id: number, source: string}> = new BehaviorSubject<{program_id: number, curriculum_id: number, source: string}>({program_id: null, curriculum_id: null, source: null});
  usersAttendances: any = {};
  curriculumsForAttendance: {name: string, id: number}[] = [];
  programsForAttendance: {program_name: string, id: number}[] = [];
  usersAttendancesForProgressLine: any = {};
  usersAttendancesWithLessonsCount: any = {};
  attendancesForYear: any = {};
  selectedCurriculumId: number;
  selectedCurriculumProgressLineId: number;
  programWithAllSchedules: Program;
  attendensesByCurriculum = 0;
  currentMode = 'timetable';
  currentDay = moment();
  selectedDay = moment();
  programSubject = new BehaviorSubject<Program>(null);
  refactoredSChedules: Schedule[];
  lessonsByCurriculum = {};
  classesByDates = {};
  months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  ];
  dialogAttendanceOverviewModal;
  dialogAttendanceMonthModal;

  constructor(
    // public dialog: MatDialog,
    private programService: ProgramService,
    private programStore: Store<ProgramReducer.ProgramState>,
    private paymentService: PaymentService,
    private authStore: Store<AuthReducer.AuthState>,
    private curriculumService: CurriculumService,
    private attendanceService: AttendanceService,
    private page: Page
    // private fonticon: TNSFontIconService

    // private router: Router,
  ) { }

  ngOnInit() {
    this.authStore.subscribe(
      (val) => {
        console.log(val);
        const auth = val.auth;
        if (auth && auth.user && auth.lastAction !== 'default') {
          this.user = auth.user;
          // this.userSubject.next(auth.user);
          this.parseAttendance();
          console.log(auth);
          if (auth.lastAction === 'UPDATE_AUTH_USER_ATTENDANCE') {
            this.setAttendance();
          }
        }
      }
    );
    this.programStore.subscribe(
      resp => {
        this.programs = resp.program.programs;
        console.log(this.programs);
        // ProgramPageComponent.bindClassesWithSchedule(this);
      }
    );
    const idsWithSubscription = [];
    this.programsIdWithSubscription = {};
    this.user.subscriptions.map((subscr => {
      if (subscr.active === 1 && subscr.approved === 1 &&
        !idsWithSubscription.includes(subscr.program_id)) {
        idsWithSubscription.push(subscr.program_id);
        if (!this.programsIdWithSubscription[subscr.program_id]) {
          this.programsIdWithSubscription[subscr.program_id] = [];
        }
        this.programsIdWithSubscription[subscr.program_id].push(subscr.id);
      }
    }));
    this.programsIdWithSubscriptionLength =  Object.keys(this.programsIdWithSubscription).length;
    if (!this.programs || this.programs.length === 0) {
        this.programService.getUsersPrograms()
          .subscribe(
            (resp: { data }) => {
              // resp.data.map( pr => {
              //   schedule.push(ProgramClassesComponent.reorganizeSchedule(pr as Program));
              // });
              // this.insertingSchedule.next(ProgramClassesComponent.reorganizeSchedule(this.program));
              let ids = [];
              resp.data.map(item => {
                if (!ids.includes(item.program_id) && this.programsIdWithSubscription[item.program_id]) {
                  this.programs.push(item);
                  ids.push(item.program_id);
                }
              });
              this.programStore.dispatch(new SetPrograms(this.programs));
              if (this.programs.length > 0) {
                this.setCalendarData();
              }
              // this.programsIdWithSubscriptionSubject.next(this.programsIdWithSubscription);
              // this.updateSchedule();
            }
          );
    } else {
        this.setCalendarData();
    }
    this.selectedAttendance.subscribe(
      resp => {
        console.log(resp);
        console.log(this.usersAttendances);
        switch (resp.source) {
          case 'progress_line': {
            if (this.usersAttendancesForProgressLine[resp.curriculum_id]) {
              this.attendensesByCurriculum = this.usersAttendancesForProgressLine[resp.curriculum_id].length;
            } else {
              this.attendensesByCurriculum = 0;
            }
            break;
          }
        }
        switch (resp.source) {
          case 'progress_line': {
            this.selectedCurriculumProgressLineId =  resp.curriculum_id;
            break;
          }
          case 'month': {
            this.selectedCurriculumId =  +resp.curriculum_id;
            break;
          }
        }
      }
    );
    this.setAttendance();
    this.getWeek();
  }
  setCalendarData() {
    const allClasses: Class[] = [];
    const allSchedules: Schedule[] = [];
    let allCurriculums: Curriculum[] = [];
    // const curIds = [];
    this.programs.map (pr => {
      if(this.programsIdWithSubscription[pr.id]) {
        allClasses.push(...pr.classes);
        pr.classes.map(cl => {
          cl.schedule.map(sch => {
            sch.class_id = cl.id;
            allSchedules.push(sch);
          });
        });
      }
      // pr.curriculum.map( curr => {
      //   if (!currIds.includes(curr.id)) {
      //     currIds.push(curr.id);
      //     allCurriculums.push(curr);
      //   }
      //   if (!this.programsForAttendance.includes(curr.id)) {
      //     this.programsForAttendance.push(curr.id);
      //   }
      //   curr.program_id = pr.id;
      // });
    });
    if (this.programs.every(p => !p.curriculum)) {
      let ids = [];
      this.programs.map(item => {
        if (!ids.includes(item.id)) {
          ids.push(item.id);
        }
      });
      this.curriculumService.getAll(null, 'curriculum', [], true, ids).subscribe(
        (resp: {data: any}) => {
          this.setCurriculums(resp.data, true);
          allCurriculums = resp.data;
          this.getAllSchedules(allClasses, allCurriculums, allSchedules);

        },
      );
    } else {
     this.programs.map( p => {
       if(this.programsIdWithSubscription[p.id]) {
         allCurriculums.push(...p.curriculum);
       }
     });
      this.setCurriculums(allCurriculums, true);
      this.getAllSchedules(allClasses, allCurriculums, allSchedules);
    }
  }
  getAllSchedules(allClasses, allCurriculums, allSchedules) {
    this.programWithAllSchedules = Object.assign({}, this.programs[0]);
    this.programWithAllSchedules.classes = allClasses;
    this.programWithAllSchedules.curriculum = allCurriculums;
    this.programWithAllSchedules.schedule = allSchedules;
    // this.refactoredSChedules = ProgramViewComponent.refactorSchedule(this.programWithAllSchedules.schedule);
    console.log(this.programs);
    console.log(this.programWithAllSchedules);
    this.getClassByDate();
    // this.programSubject.next(this.programWithAllSchedules);
  }
  // updateSchedule() {
  //   let schedule = {};
  //   this.programs.map( pr => {
  //     // schedule = ProgramClassesComponent.reorganizeSchedule(pr, [], null, schedule);
  //     // Object.keys(schedule).map(month => {
  //     //   schedule[key].subscription_id = this.programsIdWithSubscription[schedule[key].program_id];
  //     // });
  //     // new Array(this.currentMonth.daysInMonth()).fill(0).map( (day, i) => {
  //     //   schedule = ProgramClassesComponent.reorganizeSchedule(pr, [], this.currentMonth.date(i + 1), schedule, true);
  //     // });
  //   });
  //   // this.insertingSchedule.next(schedule);
  // }
  // onTodayAction() {
  //   this.onTodaySubject.next('month');
  //   this.currentMonth = moment();
  //   // this.updateSchedule();
  // }
  //
  // onRight() {
  //   this.onRightSubject.next('month');
  //   this.currentMonth.add(1, 'month');
  //   // this.updateSchedule();
  // }
  //
  // onLeft() {
  //   this.onLeftSubject.next('month');
  //   this.currentMonth.add(-1, 'month');
  //   // this.updateSchedule();
  // }
  // payForProgram(program_id) {
  //   this.paymentService.createChargeForProgram(300, program_id)
  //     .subscribe(
  //       resp => console.log(resp),
  //       err => console.log(err),
  //     );
  // }
  getHeightForAmountGraph(month: string) {
    const amount = this.getCurrentAttendanceAmount(month);
    if (amount === 0) {
      return 40;
    }
    const height = amount / 100 * 40;
    return height > 40 ? 40 : height;
  }
  toProgramPage() {
    // this.router.navigate(['/program']);
  }
  parseAttendance() {
    if (this.user.yearAttendanceFromApi) {
      const activePrograms = [];
      this.user.subscriptions.map( subscr => {
        if (subscr.active === 1 && subscr.approved === 1) {
          activePrograms.push(subscr.program_id);
        }
      });
      this.usersAttendances = DashboardStudentComponent.userAttendances(Object.assign({},this.user).yearAttendanceFromApi, 'by_month', false);
      this.usersAttendancesForProgressLine = DashboardStudentComponent.userAttendances(Object.assign({},this.user).yearAttendanceFromApi, 'progress_line');
      this.usersAttendancesWithLessonsCount = {};
      this.user.yearAttendanceFromApi.map(item => {
        if (!this.usersAttendancesWithLessonsCount[item.curriculum_id]) {
          this.usersAttendancesWithLessonsCount[item.curriculum_id] = {};
        }
        if (!this.usersAttendancesWithLessonsCount[item.curriculum_id][item.lesson_id]) {
          this.usersAttendancesWithLessonsCount[item.curriculum_id][item.lesson_id] = 0;
        }
          this.usersAttendancesWithLessonsCount[item.curriculum_id][item.lesson_id] += 1;
        // if (!this.attendancesForYear[item.program_id]) {
        //   this.attendancesForYear[item.program_id] = {};
        // }
        // if (!this.attendancesForYear[item.program_id][item.curriculum_id]) {
        //   this.attendancesForYear[item.program_id][item.curriculum_id] = [];
        // }
        // this.months.map(month => {
        //   if (this.usersAttendances[item.program_id][item.curriculum_id][month]) {
        //     this.attendancesForYear[item.program_id][item.curriculum_id].push({
        //       month: month,
        //       amount: Math.round((this.usersAttendances[item.program_id][item.curriculum_id][month].length / item.allCurriculumLessons.length) * 100),
        //       attendances: this.usersAttendances[item.program_id][item.curriculum_id][month]
        //     });
        //   } else {
        //     this.attendancesForYear[item.program_id][item.curriculum_id].push({
        //       month: month,
        //       amount: 0
        //     });
        //   }
        // });
      });
      console.log(this.programs);
      console.log(this.usersAttendances);
      console.log(this.usersAttendancesWithLessonsCount);
      console.log(this.usersAttendancesForProgressLine);
      // this.programs.map(program => {
      //   if (!this.attendancesForYear[program.id]) {
      //     this.attendancesForYear[program.id] = {};
      //   }
      //   program.curriculum.map(curr => {
      //     if (this.usersAttendances[program.id] && this.usersAttendances[program.id][curr.id]) {
      //       if (!this.attendancesForYear[program.id][curr.id]) {
      //         this.attendancesForYear[program.id][curr.id] = [];
      //       }
      //       this.months.map(month => {
      //         if (this.usersAttendances[program.id][curr.id][month]) {
      //           this.attendancesForYear[program.id][curr.id].push({
      //             month: month,
      //             amount: Math.round((this.usersAttendances[program.id][curr.id][month].length / curr.lessons.length) * 100),
      //             attendances: this.usersAttendances[program.id][curr.id][month]
      //           });
      //         } else {
      //           this.attendancesForYear[program.id][curr.id].push({
      //             month: month,
      //             amount: 0
      //           });
      //         }
      //       });
      //     }
      //   });
      // });
      console.log(this.attendancesForYear);
      if (Object.keys(this.usersAttendancesForProgressLine).length > 0) {
        const curriclumId = +Object.keys(this.usersAttendancesForProgressLine)[0];
        this.selectedAttendance.next({
          program_id: null,
          curriculum_id: curriclumId,
          source: 'progress_line'
        });
      }
      if (Object.keys(this.usersAttendances).length > 0) {
        const curriclumId = +Object.keys(this.usersAttendances[Object.keys(this.usersAttendances)[0]])[0];
        const programId = +Object.keys(this.usersAttendances)[0];
        this.selectedAttendance.next({
          program_id: programId,
          curriculum_id: curriclumId,
          source: 'month'
        });
      }
    }
  }
  getCurrentAttendanceAmount(month: string, average = false) {
    let amount = 0;
    const attendance = this.usersAttendances[this.selectedAttendance.value.program_id] ?
      this.usersAttendances[this.selectedAttendance.value.program_id][this.selectedCurriculumId] :
      null;
    if (attendance && attendance[month] && attendance[month][0].allCurriculumLessons || attendance && average === true) {
      if (average === false) {
        const uniqueLessonsId = [];
        attendance[month].map( item => {
          if (!uniqueLessonsId.includes(item.lesson_id)) {
            uniqueLessonsId.push(item.lesson_id);
          }
        });
       amount = attendance[month] ? Math.round((uniqueLessonsId.length / attendance[month][0].allCurriculumLessons.length) * 100) : 0;
      } else {
        let countMonths = 0;
        this.months.map( month => {
          amount += attendance[month] && attendance[month][0] &&  attendance[month][0].allCurriculumLessons ? Math.round((attendance[month].length / attendance[month][0].allCurriculumLessons.length) * 100) : 0;
          countMonths++;
        });
        // attendance.map( att => {
        //   if (att.amount !== 0) {
        //     amount += att.amount;
        //     countMonths++;
        //   }
        // });
        amount =  Math.round(amount / countMonths);
      }
    }
    return amount;
  }
  selectAttendance(event, source: string) {
    console.log(event);
    switch (source) {
      case 'progress_line': {
        this.selectedAttendance.next({curriculum_id: event.value, program_id: this.selectedAttendance.value.program_id, source: source});
        break;
      }
      case 'month': {
        const program_id = event.value.split(',')[1];
        const curriculum_id = event.value.split(',')[0];
        this.selectedAttendance.next({curriculum_id: +curriculum_id, program_id: +program_id, source: source});
        break;
      }
    }
    // const selectedAttendance = this.selectedAttendance.value;
    // selectedAttendance.program_id = program_id && program_id.value ? program_id.value : selectedAttendance.program_id;
    // selectedAttendance.curriculum_id = curriculum_id && curriculum_id.value ? curriculum_id.value : selectedAttendance.curriculum_id;
    // this.selectedAttendance.next(selectedAttendance);
  }
  widthProgressLine() {
    const lineWidth = this.selectedCurriculumProgressLineId && this.lessonsByCurriculum[this.selectedCurriculumProgressLineId] ?
      this.attendensesByCurriculum / this.lessonsByCurriculum[this.selectedCurriculumProgressLineId].length * 100 :
      0;
    return lineWidth > 100 ? 100 : lineWidth;
  }
  onSetOverviewMode(event) {
    const target = event.target.closest('span');
    if (target) {
      this.currentMode = target.innerText.toLowerCase();
    }
    console.log(target);
  }
  sortData(sort) {
    const data = this.refactoredSChedules.slice();
    if (!sort.active || sort.direction === '') {
      this.refactoredSChedules = data;
      return;
    }

    this.refactoredSChedules = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return this.compare(moment(a.date, 'll').unix(), moment(b.date, 'll').unix(), isAsc);
        case 'start': return this.compare(moment(a.start, 'hh:mm A').unix(), moment(b.start, 'hh:mm A').unix(), isAsc);
        case 'end': return this.compare(moment(a.end, 'hh:mm A').unix(), moment(b.end, 'hh:mm A').unix(), isAsc);
        case 'dayName': return this.compare(moment(a.year, 'YYYY').month(a.month).day(a.fullDayName).unix(), moment(b.year, 'YYYY').month(b.month).day(b.fullDayName).unix(), isAsc);
        case 'className': return this.compare(a.class_name, b.class_name, isAsc);
        default: return 0;
      }
    });
  }
  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  static userAttendances(yearAttendanceFromApi, mode: string, only_lesson_id = true, fullMonth = true) {
    const userAttendance = {};
    switch (mode) {
      case 'progress_line': {
        yearAttendanceFromApi.map( item => {
          if (!userAttendance[item.curriculum_id]) {
            userAttendance[item.curriculum_id] = [];
          }
          if (!userAttendance[item.curriculum_id].includes(item.lesson_id)) {
            console.log(item);
            userAttendance[item.curriculum_id].push(only_lesson_id ? item.lesson_id : item);
          }
        });
        break;
      }
      case 'by_month': {
        const formatMonth = fullMonth ? 'MMMM' : 'MMM';
        yearAttendanceFromApi.map( item => {
          const data = moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format(formatMonth);
          if (!userAttendance[item.program_id]) {
            userAttendance[item.program_id] = {};
          }
          if (!userAttendance[item.program_id][item.curriculum_id]) {
            userAttendance[item.program_id][item.curriculum_id] = {};
          }
          if (!userAttendance[item.program_id][item.curriculum_id][data]) {
            userAttendance[item.program_id][item.curriculum_id][data] = [];
          }
          if (!userAttendance[item.program_id][item.curriculum_id][data].includes(item.lesson_id) || !only_lesson_id) {
            userAttendance[item.program_id][item.curriculum_id][data].push(only_lesson_id ? item.lesson_id : item);
          }
        });
        break;
      }
    }
    return userAttendance;
  }
  openAttendanceOverview() {
    if (this.attendensesByCurriculum > 0) {

      // this.dialogAttendanceOverviewModal = this.dialog.open(AttendanceOverviewComponent);
      this.dialogAttendanceOverviewModal.componentInstance.curriculumId = this.selectedCurriculumProgressLineId;
      let curriculumName = '';
      this.curriculumsForAttendance.map(curr => {
        if (curr.id === this.selectedCurriculumProgressLineId) {
          curriculumName = curr.name;
        }
      });
      this.dialogAttendanceOverviewModal.componentInstance.curriculumName = curriculumName;
      this.dialogAttendanceOverviewModal.componentInstance.yearAttendance = this.usersAttendancesWithLessonsCount;
      this.dialogAttendanceOverviewModal.componentInstance.lessons = this.lessonsByCurriculum[this.selectedCurriculumProgressLineId];
      // this.selectedAttendance.next({curriculum_id: this.selectedCurriculumProgressLine.id, program_id: this.selectedAttendance.value.program_id, source: 'progress_line'});
    }
  }
  openMonthAttendanceModal(month) {
    if (this.getCurrentAttendanceAmount(month) > 0) {
      // this.dialogAttendanceMonthModal = this.dialog.open(ViewMonthCurriculumComponent);
      const attendance = DashboardStudentComponent.userAttendances(this.user.yearAttendanceFromApi, 'by_month', false);
      console.log(attendance);
      let monthAttendance = [];
      if (attendance &&
        attendance[this.selectedAttendance.value.program_id] &&
        attendance[this.selectedAttendance.value.program_id][this.selectedCurriculumId] &&
        attendance[this.selectedAttendance.value.program_id][this.selectedCurriculumId][month]
      ) {
        monthAttendance = attendance[this.selectedAttendance.value.program_id][this.selectedCurriculumId][month];
      }
      this.dialogAttendanceMonthModal.componentInstance.attendances = monthAttendance;
      this.dialogAttendanceMonthModal.componentInstance.programs = this.programsForAttendance;
      this.dialogAttendanceMonthModal.componentInstance.user = this.user;
    }
  }
  setAttendance() {
    this.attendanceService.getStudentAttendences({user_id: this.user.id, period: 'year'}).subscribe(
      (resp: {data: Attendance[]}) => {
        const currId = [];
        const prorgamIds = [];
        const ursersAttendance = resp.data;
        resp.data.map( item => {
          if (item.curriculum_id && !currId.includes(item.curriculum_id)) {
            currId.push(item.curriculum_id);
          }
          if (item.program_id && !prorgamIds.includes(item.program_id)) {
            prorgamIds.push(item.program_id);
          }
        });
        this.fetchCurriculums(currId);
        DashboardStudentComponent.fetchPrograms(prorgamIds, this.programsForAttendance, this.programService).subscribe();
        currId.map(curr => {
          this.curriculumService.getAll(curr, 'lesson').subscribe(
            (response: {data: Lesson[]}) => {
              console.log(response);
              this.lessonsByCurriculum[curr] = response.data;
              if (Object.keys(this.lessonsByCurriculum).length === currId.length) {
                ursersAttendance.map( item => {
                  item.allCurriculumLessons = this.lessonsByCurriculum[item.curriculum_id];
                });
                this.user.yearAttendanceFromApi = ursersAttendance;
                this.parseAttendance();
                this.authStore.dispatch(new UpdateAuthUser({yearAttendanceFromApi: ursersAttendance }));
              }
            }
          );
        });

      }
    );
  }
  fetchCurriculums(currIds) {
    this.curriculumService.getAll(null, 'curriculum', currIds, false).subscribe(
      (resp: {data: any}) => {
        console.log(resp);
        this.setCurriculums(resp.data);
      }
    );
  }
 setCurriculums(curriculums, allInfo = false) {
   const currIdT = [];
   this.curriculumsForAttendance.map(currS => {
     if (!currIdT.includes(currS.id)) {
       currIdT.push(currS.id);
     }
   });
   console.log(this.curriculumsForAttendance);
   if (!allInfo) {
     Object.keys(curriculums).map( curr => {
       curriculums[curr].map(c => {
         if (!currIdT.includes(c.id)) {
           currIdT.push(c.id);
           this.curriculumsForAttendance.push(c);
         }
       });
     });
   } else {
     let curriculumByPrograms = {};
     console.log(curriculums, this.programs, currIdT);
     curriculums.map(c => {
       if (!curriculumByPrograms[c.program_id]) {
         curriculumByPrograms[c.program_id] = [];
       }
       curriculumByPrograms[c.program_id].push(c);
       if (!currIdT.includes(c.id)) {
         currIdT.push(c.id);
         this.curriculumsForAttendance.push(c);
       }
     });
     console.log(curriculumByPrograms);
     Object.keys(curriculumByPrograms).map(pr_id => {
       this.programs.map(pr => {
         if (+pr_id === +pr.id) {
           pr.curriculum = curriculumByPrograms[pr_id];
           this.programStore.dispatch(new UpdateProgram(pr));
         }
       });
     });
   }
   console.log(this.curriculumsForAttendance);
 }
 static fetchPrograms(programsId, programsArray, programService, trial = false, user_id = null) {
   const programIdT = [];
   programsArray.map(prS => {
     if (!programIdT.includes(prS.id)) {
       programIdT.push(prS.id);
     }
   });
   return  new Observable(observer => {
     const {next, error} = observer;
     programService.getProgamByIds(programsId, trial, user_id).subscribe(
       (resp: {data: any[]}) => {
         console.log(resp);
         Object.keys(resp.data).map( program => {
           console.log(resp);
           resp.data[program].map(pr => {
             if (!programIdT.includes(pr.id)) {
               programIdT.push(pr.id);
               programsArray.push(pr);
             }
           });
         });
         observer.next(programsArray);
         console.log(trial, programsArray);
       });
     console.log(trial, programsArray);
     }
   );
   // return programsArray;
 }
  getCurriculumForAttendance(program_id) {
    const curriclums = [];
    if (this.usersAttendances[program_id]) {
      Object.keys(this.usersAttendances[program_id]).map(currId => {
        this.curriculumsForAttendance.map( curr => {
          if (curr.id === +currId) {
            curriclums.push(curr);
          }
        });
      });
    }
    return curriclums;
  }
  fromResourceConvert(){
  return fromResource(this.user.avatar);
  }
  nextWeek() {
    this.startOfWeek.add(7, 'days' );
    this.endOfWeek.add(7, 'days');
    this.getWeek();
  }

  prevWeek() {
      this.startOfWeek.add(-7, 'days' );
      this.endOfWeek.add(-7, 'days');
    this.getWeek();
  }
  getWeek() {
    this.week = [];
    let day = this.startOfWeek;
    while (day <= this.endOfWeek) {
      this.week.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
  }
  getDayNumber(day) {
    return moment(day).date();
  }

  getDayName(day) {
    return moment(day).format('dddd').charAt(0);
  }
  setSelectedDay(day) {
    const label = <Label>this.page.getViewById("selected-day");
    label.text = moment(day).format('ll');
    this.selectedDay = day;
    this.getClassByDate();
  }
  getSelectedDay() {
   return moment(this.selectedDay).format('ll');
  }
  checkDay(day: any, forDay: string) {
    switch (forDay) {
        case 'current': {
          return  moment(day).isSame(this.currentDay, 'day');
        }
        case 'selected': {
          return  moment(day).isSame(this.selectedDay, 'day');
        }
    }
  }
  showCurrentLessons() {
      const actionOptions: ActionOptions = {
          title: "Your Title",
          message: "Your message",
          cancelButtonText: "Cancel",
          actions: ["Option1", "Option2"],
          cancelable: true // Android only
      };

      action(actionOptions).then((result) => {
          console.log("Dialog result: ", result);
          if (result === "Options1") {
              // Do action 1
          } else if (result === "Option2") {
              // Do action 2
          }
      });
  }
  getClassByDate() {
      // const time = moment(this.timeRange.min, 'HH:mm A').add(i, 'hours');
      // const programs = this.source === 'overview' ? [this.program] : this.programs;
      this.classesByDates = ScheduleFacade.getClassByDate(this.programWithAllSchedules, [this.programWithAllSchedules], this.selectedDay, this.classesByDates, false);
      console.log(this.classesByDates, 'this.classesByDates***************this.classesByDates')
  }
}
