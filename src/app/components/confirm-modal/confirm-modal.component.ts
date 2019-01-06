import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Subject} from 'rxjs/internal/Subject';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  static source;
  static sourceSchedule = null;
  static repeatable = false;
  static setData = false;
  static insertedObject: any;
  static direction: string;
  static students_in_program: number;
  static methodDelete: string;
  static methodDeleteParam: any;
  static methodDeleteAllParam: any;
  static methodDeleteAll: string;
  static modalRef: any;
  static withButtons = true;
  static textModal;
  static textButton;
  static direction_delete_program = 'delete_program';

  monthsNumber: Subject<any> = new BehaviorSubject(null);
  moveMonthsCarousel: BehaviorSubject<string> = new BehaviorSubject(null);
  insertingSchedule: Subject<any> = new BehaviorSubject<any>(null);
  repeatable = false;
  daySelected = false;
  source = 'delete';
  studentsNumber;
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
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
  constructor() { }

  ngOnInit() {
    this.source = ConfirmModalComponent.source;
    this.repeatable = ConfirmModalComponent.repeatable;
    this.studentsNumber = ConfirmModalComponent.students_in_program;
    if (this.isWithData() && ConfirmModalComponent.sourceSchedule) {
      this.insertingSchedule.next(ConfirmModalComponent.sourceSchedule);
    }
  }
  ngOnDestroy() {
    this.resetProperties();
  }
  close() {
    if (ConfirmModalComponent.modalRef) {
      ConfirmModalComponent.modalRef.close();
    }
    this.resetProperties();
  }
  actionDelete() {
    if (this.repeatable === true) {
      ConfirmModalComponent.insertedObject[ConfirmModalComponent.methodDelete](ConfirmModalComponent.methodDeleteParam, ConfirmModalComponent.methodDeleteAllParam);
    } else {
      ConfirmModalComponent.insertedObject[ConfirmModalComponent.methodDelete](ConfirmModalComponent.methodDeleteParam);
    }
    console.log(ConfirmModalComponent.modalRef);
    ConfirmModalComponent.modalRef.close();
  }
  actionDeleteAll() {
    ConfirmModalComponent.insertedObject[ConfirmModalComponent.methodDeleteAll](ConfirmModalComponent.methodDeleteParam);
    ConfirmModalComponent.modalRef.close();
  }
  isProgramDirectionWithForce() {
    return ConfirmModalComponent.direction === ConfirmModalComponent.direction_delete_program && ConfirmModalComponent.methodDeleteParam &&
      ConfirmModalComponent.methodDeleteParam.force && ConfirmModalComponent.methodDeleteParam.force === true;
  }
  getAsk() {
    switch (this.source) {
      case 'subscribe': {
        return 'Subscribe to the program?';
      }
      case 'unsubscribe': {
        return 'Unsubscribe to the program?';
      }
      case 'resend_request': {
        return 'Resend request?';
      }
      case 'send_request': {
        return 'Send request?';
      }
      case 'need_charge': {
        return  ConfirmModalComponent.textModal;
      }
      case 'info': {
        return  ConfirmModalComponent.textModal;
      }
      case 'stop_subscription': {
        return  ConfirmModalComponent.textModal ? ConfirmModalComponent.textModal : 'Stop subscription?';
      }
      case 'continue_subscription': {
        return  ConfirmModalComponent.textModal;
      }
      case 'deleteProgram': {
        return  ConfirmModalComponent.textModal;
      }
      case 'toggle_subscription': {
        return  ConfirmModalComponent.textModal;
      }
      case 'teacher_subscription': {
        return  ConfirmModalComponent.textModal;
      }
      default: {
        return  ConfirmModalComponent.textModal;
      }
    }
  }
  getButtonTitle() {
    switch (this.source) {
      case 'deleteProgram': {
        return 'Delete';
      }
      case 'subscribe': {
        return 'Subscribe';
      }
      case 'unsubscribe': {
        return 'Unsubscribe';
      }
      case 'resend_request': {
        return 'Resend';
      }
      case 'send_request': {
        return 'Send';
      }
      case 'need_charge': {
        return 'Go to pay';
      }
      case 'stop_subscription': {
        return ConfirmModalComponent.textButton;;
      }
      case 'continue_subscription': {
        return 'Continue';
      }
      case 'toggle_subscription': {
        return  ConfirmModalComponent.textButton;
      }
      case 'pause_teacher_subscription': {
        return  'Pause';
      }
      default: {
        return  ConfirmModalComponent.textButton ?  ConfirmModalComponent.textButton  : 'Delete';
      }
    }
  }
  onMonthToRight() {
    this.currentMonth -= 1;
    console.log(this.currentMonth, 'right');
    if (this.currentMonth < 1) {
      this.currentYear--;
      this.currentMonth = 12;
    }
    this.monthsNumber.next({month: this.currentMonth, year: this.currentYear});
    this.moveMonthsCarousel.next('right');
  }

  onMonthToLeft() {
    this.currentMonth += 1;
    console.log(this.currentMonth, 'left');
    if (this.currentMonth > 12) {
      this.currentYear++;
      this.currentMonth = 1;
    }
    this.monthsNumber.next({month: this.currentMonth, year: this.currentYear});
    this.moveMonthsCarousel.next('left');
  }
  onSelectedDay(event) {
    console.log(event);
    if (event.schedules && event.schedules.length > 0) {
      ConfirmModalComponent.methodDeleteParam.startDay = +event.day;
      ConfirmModalComponent.methodDeleteParam.startMonth = +event.month;
      ConfirmModalComponent.methodDeleteParam.startYear = this.currentYear;
      this.daySelected = true;
    } else {
      this.daySelected = false;
    }
  }
  isWithData() {
    return ConfirmModalComponent.setData === true;
  }
  isWithButtons() {
    const conditionOne = ConfirmModalComponent.withButtons === true;
    if (this.isWithData()) {
      return conditionOne && this.daySelected;
    }
    return conditionOne;
  }
  resetProperties() {
    ConfirmModalComponent.source = null;
    ConfirmModalComponent.sourceSchedule = null;
    ConfirmModalComponent.repeatable = false;
    ConfirmModalComponent.setData = false;
    ConfirmModalComponent.insertedObject = null;
    ConfirmModalComponent.direction = null;
    ConfirmModalComponent.students_in_program = null;
    ConfirmModalComponent.methodDelete = null;
    ConfirmModalComponent.methodDeleteParam = null;
    ConfirmModalComponent.methodDeleteAllParam = null;
    ConfirmModalComponent.methodDeleteAll = null;
    ConfirmModalComponent.modalRef = null;
    ConfirmModalComponent.withButtons = true;
    ConfirmModalComponent.textModal = null;
    ConfirmModalComponent.textButton = null;
    ConfirmModalComponent.direction_delete_program = 'delete_program';
  }
}
