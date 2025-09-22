import { Component, inject, OnInit } from '@angular/core';
import { Payment } from '../../../_models/Payment';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../../_services/member/member.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Pagination } from '../../../_models/Pagination';
import { MatSelectModule } from '@angular/material/select';
import { DropDownMember } from '../../../_models/Member';
import { SharedService } from '../../../_services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../_shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-list',
  imports: [
    DatePipe,
    CommonModule,
    MatPaginatorModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css',
})
export class PaymentListComponent implements OnInit {
  memberService = inject(MemberService);
  sharedService = inject(SharedService);
  toast = inject(ToastrService);
  dataSourceForPayment: Payment[] = [];
  totalPayments = 100;
  pageSize = 5;
  pageNumber = 1;
  pageSizeOptions = [5, 10, 20, 50, 100, 200];
  year = new Date().getFullYear();
  years = Array.from({ length: this.year - 1980 + 1 }, (_, i) => this.year - i);
  month: number | null = null;
  paymentType: boolean | null = null;
  memberId: number | null = null;
  clubMembers: DropDownMember[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.memberService
      .getMembersPayments(
        this.pageNumber,
        this.pageSize,
        this.memberId,
        this.paymentType,
        this.month,
        this.year
      )
      .subscribe({
        next: (response: any) => {
          this.dataSourceForPayment = response.body || [];
          let pagination: Pagination = JSON.parse(
            response.headers.get('Pagination')!
          );
          this.pageNumber = pagination.currentPage!;
          this.pageSize = pagination.itemsPerPage!;
          this.totalPayments = pagination.totalItems!;

          this.clubMembers = this.sharedService.clubMembers;
        },
        error: (error) => {
          console.error('Error loading payments:', error);
        },
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.memberService.deleteMemberPayment(id).subscribe({
          next: () => {
            this.toast.success(
              'Записот за платена членарина беше успешно отстранет'
            );
            this.loadPayments();
          },
          error: (error) => {
            console.error('Error deleting payment:', error);
          },
        });
      }
    });
  }

  resetFilters() {
    this.month = null;
    this.year = new Date().getFullYear();
    this.memberId = null;
    this.loadPayments();
  }

  refetchData() {
    this.loadPayments();
  }

  onPageChange($event: PageEvent) {
    throw new Error('Method not implemented.');
  }
}
