import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterMemberComponent } from './dashboard/register-member/register-member.component';
import { MemberListComponent } from './dashboard/members/member-list/member-list.component';
import { TrainingListComponent } from './dashboard/trainings/training-list/training-list.component';
import { MemberDetailComponent } from './dashboard/members/member-detail/member-detail.component';
import { PaymentListComponent } from './dashboard/payments/payment-list/payment-list.component';
import { TrainingDetailComponent } from './dashboard/trainings/training-detail/training-detail.component';
import { PaymentDetailComponent } from './dashboard/payments/payment-detail/payment-detail.component';
import { NoteListComponent } from './dashboard/notes/note-list/note-list.component';
import { NoteDetailComponent } from './dashboard/notes/note-detail/note-detail.component';
import { authGuard } from './_guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClubDetailsComponent } from './dashboard/club-details/club-details.component';
import { EditMemberComponent } from './dashboard/members/edit-member/edit-member.component';
import { NotesAndBeltsComponent } from './dashboard/members/member-detail/notes-and-belts/notes-and-belts.component';
import { MembershipFeeComponent } from './dashboard/members/member-detail/membership-fee/membership-fee.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AttendancePerformanceComponent } from './dashboard/members/member-detail/attendance-performance/attendance-performance.component';

export const routes: Routes = [
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],

    children: [
      { path: 'register-member', component: RegisterMemberComponent },
      { path: 'club-details', component: ClubDetailsComponent },
      { path: 'members', component: MemberListComponent },
      { path: 'trainings', component: TrainingListComponent },
      { path: 'payments', component: PaymentListComponent },
      { path: 'notes', component: NoteListComponent },
      { path: 'edit-member/:id', component: EditMemberComponent },
      { path: 'trainings/:id', component: TrainingDetailComponent },
      { path: 'payments/:id', component: PaymentDetailComponent },
      {
        path: 'members/:id',
        component: MemberDetailComponent,
        children: [
          { path: 'notes-and-belts', component: NotesAndBeltsComponent },
          { path: 'membership-fee', component: MembershipFeeComponent },
          {
            path: 'attendance-performance',
            component: AttendancePerformanceComponent,
          },
        ],
      },
      { path: 'notes:id', component: NoteDetailComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
