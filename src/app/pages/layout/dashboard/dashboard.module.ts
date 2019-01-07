import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import { DashboardStudentComponent } from './dashboard-student/dashboard-student.component';
// import {SharedModule} from '@sharedModules/shared-module/shared-module.module';
import {PaymentService} from '../../../services/payment/payment.service';
import {TNSFontIconModule, TNSFontIconService} from "nativescript-ng2-fonticon";
// import { DashboardTeacherComponent } from './dashboard-teacher/dashboard-teacher.component';
// import {ConfirmModalComponent} from '@components/confirm-modal/confirm-modal.component';
// import {MatSortModule} from '@node_modules/@angular/material';
// import {ViewCurriculumComponent} from '@pages/layout/program/program-page/program-curriculum/view-curriculum/view-curriculum.component';
// import {AttendanceOverviewComponent} from '@components/attendance-overview/attendance-overview.component';
// import {ViewMonthCurriculumComponent} from '@components/view-month-curriculum/view-month-curriculum.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    // SharedModule,
    // MatSortModule,
      TNSFontIconModule
  ],
  declarations: [DashboardPageComponent, DashboardStudentComponent,],
  providers: [PaymentService, TNSFontIconService],
  // entryComponents: [ConfirmModalComponent, ViewCurriculumComponent, AttendanceOverviewComponent, ViewMonthCurriculumComponent]
})
export class DashboardModule { }
