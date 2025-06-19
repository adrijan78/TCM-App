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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'register-member', component: RegisterMemberComponent },
      { path: 'club-details', component: ClubDetailsComponent },
      { path: 'members', component: MemberListComponent },
      { path: 'members/:id', component: MemberDetailComponent },
      { path: 'trainings', component: TrainingListComponent },
      { path: 'trainings/:id', component: TrainingDetailComponent },
      { path: 'payments', component: PaymentListComponent },
      { path: 'payments/:id', component: PaymentDetailComponent },
      { path: 'notes', component: NoteListComponent },
      { path: 'notes:id', component: NoteDetailComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
