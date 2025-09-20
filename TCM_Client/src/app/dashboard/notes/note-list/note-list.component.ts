import { Component, inject, OnInit, signal } from '@angular/core';
import { Note } from '../../../_models/Note';
import { MatDialog } from '@angular/material/dialog';
import { NoteComponent } from '../note/note.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddNoteComponent } from '../add-note/add-note.component';
import { NoteService } from '../../../_services/note/note.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DropDownMember } from '../../../_models/Member';
import { SharedService } from '../../../_services/shared.service';
import { Pagination } from '../../../_models/Pagination';
import { AddNote } from '../../../_models/_enums/AddNote';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-note-list',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css',
})
export class NoteListComponent implements OnInit {
  sharedService = inject(SharedService);
  noteService = inject(NoteService);
  toast = inject(ToastrService);

  notes = signal<Note[] | null>(null);
  totalNotes = 0;
  pageSize = 5;
  pageNumber = 1;
  pageSizeOptions = [5, 10, 20, 50];
  selectedPriority = signal<number | null>(null);
  //Se handle-na na BE
  fromMemberId = 0;
  searchTerm = signal<string>('');
  newNote: string = '';
  clubMembers: DropDownMember[] = [];
  toMemberId: number | null = null;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    //Call get notes
    this.getNotes();
  }

  getNotes() {
    this.noteService
      .getClubNotes(
        0,
        this.pageNumber,
        this.pageSize,
        this.selectedPriority(),
        this.searchTerm(),
        this.toMemberId
      )
      .subscribe({
        next: (notes: any) => {
          this.notes.set(notes.body as Note[] | null);
          this.clubMembers = this.sharedService.clubMembers;
          let pagination: Pagination = JSON.parse(
            notes.headers.get('Pagination')!
          );
          this.pageNumber = pagination.currentPage!;
          this.pageSize = pagination.itemsPerPage!;
          this.totalNotes = pagination.totalItems!;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  searchBySearchTerm(ev: any) {
    this.searchTerm.set(ev);
    if (this.searchTerm().length >= 3 || this.searchTerm().length == 0) {
      this.getNotes();
    }
  }

  addNote() {
    // if (this.newNote.trim()) {
    //   this.notes.unshift(this.newNote.trim());
    //   this.newNote = '';
    // }
  }

  onDeleteNote(index: number) {
    this.noteService.deleteNote(index).subscribe({
      next: () => {
        this.getNotes();
      },
    });
  }

  onPageChange(ev: any) {
    if (this.pageNumber !== ev.pageIndex + 1 || this.pageSize !== ev.pageSize) {
      this.pageNumber = ev.pageIndex + 1;
      this.pageSize = ev.pageSize;
      this.getNotes();
    }
  }

  //openAddNoteDialog() {
  // const dialogRef = this.dialog.open(AddNoteDialogComponent, {
  //   width: '400px',
  //   data: {}
  // });
  // dialogRef.afterClosed().subscribe(result => {
  //   if (result) {
  //     this.notes.push({
  //       ...result,
  //       createdAt: new Date()
  //     });
  //   }
  // });
  //}

  openAddNoteDialog(): void {
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: '400px',
      data: { date: new Date(), isFromNoteList: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        var note: AddNote = {
          title: result.title,
          content: result.content,
          createdAt: new Date(),
          fromMemberId: 0,
          toMemberId: result.toMember,
          trainingId: null,
          priority:
            result.priority == null || result.priority == ''
              ? 1
              : result.priority,
        };

        this.noteService.addNote(note).subscribe({
          next: () => {
            this.toast.success('Белешката е креирана');
            this.getNotes();
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        console.log('Dialog closed without adding training.');
      }
    });
  }

  resetFilters() {
    this.selectedPriority.set(null);
    this.toMemberId = null;
    this.searchTerm.set('');
    this.applyFilters();
  }

  applyFilters() {
    this.getNotes();
  }

  mapPriority(priority: number): string {
    switch (priority) {
      case 1:
        return 'Низок';
      case 2:
        return 'Среден';
      case 3:
        return 'Висок';
      default:
        return 'Непознат приоритет';
    }
  }

  truncateContent(content: string): string {
    const maxLength = 50; // Set your desired max length
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }
}
