import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgxChartsModule,
  ScaleType,
  LegendPosition,
} from '@swimlane/ngx-charts'; // Import ScaleType

import { MatTabsModule } from '@angular/material/tabs'; // Import MatTabsModule
import { MemberService } from '../../../_services/member/member.service';
import { Member } from '../../../_models/Member';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MemberTrainingData } from '../../../_models/MemberTrainingData';
import { TrainingService } from '../../../_services/training/training.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedService } from '../../../_services/shared.service';
import { AcountService } from '../../../_services/account/acount.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
  ],

  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  acountService = inject(AcountService);
  memberService = inject(MemberService);
  trainingService = inject(TrainingService);
  toast = inject(ToastrService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  sharedService = inject(SharedService);
  id: number = 0;
  member = signal<Member | null>(null);
  selectedTabIndex = 0;

  constructor() {
    effect(() => {
      var beltChange = this.memberService.beltChanged();
      if (beltChange > 0) {
        this.getMemberById();
      }
    });

    if (this.router.url.includes('/notes-and-belts')) {
      this.onRouteChange('notes-and-belts');
    } else if (this.router.url.includes('/membership-fee')) {
      this.onRouteChange('membership-fee');
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.id = +params['id'];
      this.getMemberById();
    });
  }

  getMemberById() {
    this.memberService.getMember(this.id).subscribe({
      next: (res) => {
        this.member.set(res);
        this.memberService.memberStartedOn = new Date(res.startedOn);
      },
      error: (err) => {
        console.log('Error: ', err);
      },
    });
  }

  payMembershipFee() {
    let priceId = localStorage.getItem('priceId');
    if (!priceId) {
      this.toast.error(
        'Моментално не можете да платите членарина. Ве молиме повторно најавете се и пробајте.'
      );
      return;
    }
    this.acountService
      .payMembership(priceId, this.member()!.id, this.member()!.email)
      .subscribe({
        next: (res: any) => {
          window.location.href = res.data;
        },
      });
  }

  onTabChange(index: number) {
    if (index === 0) {
      this.router.navigate(['attendance-performance'], {
        relativeTo: this.route,
      });
    } else if (index === 1) {
      this.router.navigate(['membership-fee'], { relativeTo: this.route });
    } else if (index === 2) {
      this.router.navigate(['notes-and-belts'], { relativeTo: this.route });
    }
  }
  onRouteChange(url?: string) {
    if (url == 'attendance-performance') {
      this.router.navigate(['attendance-performance'], {
        relativeTo: this.route,
      });
    } else if (url == 'membership-fee') {
      this.selectedTabIndex = 1;
      this.router.navigate(['membership-fee'], { relativeTo: this.route });
    } else if (url == 'notes-and-belts') {
      this.selectedTabIndex = 2;
      this.router.navigate(['notes-and-belts'], { relativeTo: this.route });
    }
  }
}
