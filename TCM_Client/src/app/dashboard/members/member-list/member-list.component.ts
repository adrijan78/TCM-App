import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../_services/member/member.service';
import { Member } from '../../../_models/Member';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
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
    MatPaginator
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  private memberService = inject(MemberService);
  private router = inject(Router);
  private toast = inject(ToastrService);
  members: Member[] = [];
  searchTerm: string = '';
  selectedBelt: string = '';
  filteredMembers: Member[] = [];
  uniqueBelts: string[] = [];
   paginator = signal<MatPaginator | null>(null);
  totalMembers = 100; // вкупен број на членови
  pageSize = 10; // број на членови по страница
  pageSizeOptions = [5, 10, 20, 50]; // опции за број на членови по страница

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.memberService.getMembers().subscribe({
      next: (res) => {
        this.members = res;
        this.extractBelts();
        this.applyFilters();
      },
      error: (err) => {
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }
  extractBelts() {
    const belts = this.members
      .map((m) => m.currentBelt?.name)
      .filter((belt): belt is string => !!belt);
    this.uniqueBelts = Array.from(new Set(belts));
  }

  applyFilters() {
    this.filteredMembers = this.members.filter((m) => {
      const matchesSearch =
        !this.searchTerm ||
        m.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesBelt =
        !this.selectedBelt || m.currentBelt?.name === this.selectedBelt;

      return matchesSearch && matchesBelt;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedBelt = '';
    this.applyFilters();
  }
  onPageChange(ev:any){

  }

  // openEditDialog(member: Member): void {
  //   const dialogRef = this.dialog.open(EditMemberDialogComponent, {
  //     width: '400px',
  //     data: { member }
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // Refresh or update logic if needed
  //     }
  //   });
  // }
}
