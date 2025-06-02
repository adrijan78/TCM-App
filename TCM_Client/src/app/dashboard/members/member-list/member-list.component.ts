import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { DatePipe, NgClass } from '@angular/common';

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
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  displayedColumns: string[] = [
    'profilePicture',
    'firstName',
    'lastName',
    'email',
    'age',
    // 'belts',
    'isCoach',
    'isActive',
    'height',
    'weight',
    'startedOn',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Member>();

  private memberService = inject(MemberService);
  members: Member[] = [];

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.memberService.getMembers().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
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
