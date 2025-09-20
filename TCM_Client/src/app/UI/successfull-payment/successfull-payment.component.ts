import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AcountService } from '../../_services/account/acount.service';

@Component({
  selector: 'app-successfull-payment',
  imports: [MatCardModule, MatIconModule, RouterModule],
  templateUrl: './successfull-payment.component.html',
  styleUrl: './successfull-payment.component.css',
})
export class SuccessfullPaymentComponent implements OnInit {
  accountService = inject(AcountService);
  currentUser = this.accountService.currentUser();
  roles: any[] = [];

  ngOnInit(): void {
    this.roles = this.currentUser?.roles || [];
  }
}
