import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../_services/member/member.service';
import { Member } from '../../../_models/Member';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Pagination, PaginationResult } from '../../../_models/Pagination';
import { DialogComponent } from '../../../_shared/dialog/dialog/dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { BeltMkName } from '../../../_mappings/beltMapping';

@Component({
  selector: 'app-member-list',
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    DatePipe,
    NgClass,
    NgFor,
    RouterModule,
    MatExpansionModule,
    MatSelectModule,
    MatProgressSpinner,
    MatPaginatorModule,
    MatPaginator,
    MatDialogModule,
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  beltMkNames = BeltMkName;
  private memberService = inject(MemberService);
  private router = inject(Router);
  private toast = inject(ToastrService);

  members: Member[] | null = null;
  searchTerm: string = '';
  selectedBelt: string = '';
  selectedAgeCategory: number | null = null;
  filteredMembers: Member[] = [];
  uniqueBelts: string[] = [];
  paginator = signal<MatPaginator | null>(null);
  totalMembers = 100; // вкупен број на членови
  pageSize = 5; // број на членови по страница
  pageNumber = 1;
  pageSizeOptions = [5, 10, 20, 50]; // опции за број на членови по страница

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.memberService
      .getMembers(
        this.pageNumber,
        this.pageSize,
        this.selectedBelt,
        this.selectedAgeCategory,
        this.searchTerm
      )
      .subscribe({
        next: (res) => {
          this.members = res.body as Member[];
          let pagination: Pagination = JSON.parse(
            res.headers.get('Pagination')!
          );
          this.pageNumber = pagination.currentPage!;
          this.pageSize = pagination.itemsPerPage!;
          this.totalMembers = pagination.totalItems!;
          //this.extractBelts();
          //this.applyFilters();
        },
        error: (err) => {},
        complete: () => {
          console.log('Request completed');
        },
      });
  }

  applyFilters() {
    this.getMembers();
  }

  searchBySearchTerm() {
    if (this.searchTerm.length >= 3 || this.searchTerm.length == 0) {
      this.getMembers();
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedBelt = '';
    this.selectedAgeCategory = null;
    this.applyFilters();
  }
  onPageChange(ev: any) {
    if (this.pageNumber !== ev.pageIndex + 1 || this.pageSize !== ev.pageSize) {
      this.pageNumber = ev.pageIndex + 1;
      this.pageSize = ev.pageSize;
      this.getMembers();
    }
  }

  openDialog(id: number): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          title: 'Деактивирање член',
          message: `Членот ќе биде деактивиран?Дали го сакате ова?`,
        },
      })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.memberService.deactivateMember(id).subscribe({
            next: (res) => {
              this.toast.success('Членот беше успешно деактивиран');
              this.getMembers();
            },
            error: (err) => {
              this.toast.error('Проблем при деактивирање на член');
            },
            complete: () => {},
          });
        }
      });
  }
}
