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
import { Pagination, PaginationResult } from '../../../_models/Pagination';

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
  members: Member[]|null = null;
  searchTerm: string = '';
  selectedBelt: string = '';
  selectedAgeCategory: number|null = null;
  filteredMembers: Member[] = [];
  uniqueBelts: string[] = [];
   paginator = signal<MatPaginator | null>(null);
  totalMembers = 100; // вкупен број на членови
  pageSize = 5; // број на членови по страница
  pageNumber=1;
  pageSizeOptions = [5, 10, 20, 50]; // опции за број на членови по страница

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.memberService.getMembers(this.pageNumber,this.pageSize,
      this.selectedBelt,this.selectedAgeCategory,this.searchTerm).subscribe({
      next: (res) => {
        this.members = res.body as Member[];
        let pagination: Pagination = JSON.parse(res.headers.get('Pagination')!)
        this.pageNumber=pagination.currentPage!;
        this.pageSize = pagination.itemsPerPage!;
        this.totalMembers=pagination.totalItems!;
        //this.extractBelts();
        //this.applyFilters();
      },
      error: (err) => {
      },
      complete: () => {
        console.log('Request completed');
      }, 
    });
  }


  applyFilters() {
    
    this.getMembers();
  }

  searchBySearchTerm(){
    if(this.searchTerm.length>=3 || this.searchTerm.length==0){
      this.getMembers();
    }

  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedBelt = '';
    this.selectedAgeCategory=null;
    this.applyFilters();
  }
  onPageChange(ev:any){
    if(this.pageNumber !== ev.pageIndex+1 ||this.pageSize!==ev.pageSize){
      this.pageNumber=ev.pageIndex+1;
      this.pageSize=ev.pageSize;
      this.getMembers();
    }
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
