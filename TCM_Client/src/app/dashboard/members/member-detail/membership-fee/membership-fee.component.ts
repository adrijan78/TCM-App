import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';
import { MemberService } from '../../../../_services/member/member.service';
import { ActivatedRoute } from '@angular/router';
import { Payment } from '../../../../_models/Payment';
import { Pagination } from '../../../../_models/Pagination';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../_shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-membership-fee',
  imports: [CommonModule, MatPaginatorModule],

  templateUrl: './membership-fee.component.html',
  styleUrl: './membership-fee.component.css',
})
export class MembershipFeeComponent implements OnInit {
  memberService = inject(MemberService);
  toast = inject(ToastrService);
  route = inject(ActivatedRoute);
  id = signal<number | string>(0);
  dataSourceForPayment: Payment[] = [];
  totalPayments = 100; // вкупен број на членови
  pageSize = 5; // број на членови по страница
  pageNumber = 1;
  pageSizeOptions = [5, 10, 20, 50]; // опции за број на членови по страница
  lastPaymentDate: any;
  nextPaymentDate: any;
  today = new Date();

  constructor(private dialog: MatDialog) {
    this.id.set(this.route.parent?.snapshot.paramMap.get('id')!);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.memberService
      .getMemberPayments(+this.id()!, this.pageNumber, this.pageSize)
      .subscribe((payments: any) => {
        this.dataSourceForPayment = payments.body;

        this.lastPaymentDate = this.dataSourceForPayment[0]?.paymentDate;

        this.nextPaymentDate = new Date(
          this.dataSourceForPayment[0]?.nextPaymentDate
        );

        let pagination: Pagination = JSON.parse(
          payments.headers.get('Pagination')!
        );
        this.pageNumber = pagination.currentPage!;
        this.pageSize = pagination.itemsPerPage!;
        this.totalPayments = pagination.totalItems!;
      });
  }

  deletePayment(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        questionTitle: 'Дали сте сигурни?',
        questionBody:
          'Оваа операција ќе го избрише записот за платена членарина. Дали сте сигурни дека го сакате тоа?',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.memberService.deleteMemberPayment(id).subscribe({
          next: () => {
            this.toast.success(
              'Записот за платена членарина беше успешно отстранет'
            );
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting payment:', error);
          },
        });
      }
    });
  }

  onPageChange(ev: any) {
    if (this.pageNumber !== ev.pageIndex + 1 || this.pageSize !== ev.pageSize) {
      this.pageNumber = ev.pageIndex + 1;
      this.pageSize = ev.pageSize;
      this.loadData();
    }
  }
}
