import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MemberService } from '../../_services/member/member.service';
import { AcountService } from '../../_services/account/acount.service';

@Component({
  selector: 'app-failed-payment',
  imports: [MatCardModule, MatIconModule, RouterModule],
  templateUrl: './failed-payment.component.html',
  styleUrl: './failed-payment.component.css',
})
export class FailedPaymentComponent implements OnInit {
  accountService = inject(AcountService);
  currentUser = this.accountService.currentUser();
  roles: any[] = [];

  ngOnInit(): void {
    this.roles = this.currentUser?.roles || [];
  }
}
