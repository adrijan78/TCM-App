import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { AddNote } from '../../../../_models/_enums/AddNote';
import { AddNoteComponent } from '../../../notes/add-note/add-note.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoteService } from '../../../../_services/note/note.service';
import { ToastrService } from 'ngx-toastr';
import { Note } from '../../../../_models/Note';
import { FormsModule } from '@angular/forms';
import { NoteComponent } from '../../../notes/note/note.component';
import { MemberService } from '../../../../_services/member/member.service';
import { Belt } from '../../../../_models/Belt';
import { DialogRef } from '@angular/cdk/dialog';
import { AddBeltComponent } from './add-belt/add-belt.component';
import { ConfirmationDialogComponent } from '../../../../_shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-notes-and-belts',
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NoteComponent,
  ],
  templateUrl: './notes-and-belts.component.html',
  styleUrl: './notes-and-belts.component.css',
})
export class NotesAndBeltsComponent implements OnInit {
  route = inject(ActivatedRoute);
  id = signal<number | string>(0);
  noteService = inject(NoteService);
  memberService = inject(MemberService);
  toast = inject(ToastrService);
  notesForMember = signal<Note[] | null>(null);
  searchTermNotes: string = '';
  memberBeltExams = signal<Belt[]>([]);

  constructor(private dialog: MatDialog) {
    this.id.set(this.route.parent?.snapshot.paramMap.get('id')!);
  }

  ngOnInit() {
    this.getNotesForMember();
    this.getMemberBeltExams();
  }

  getNotesForMember() {
    this.noteService
      .getNotesForMember(new Date().toDateString(), 0, +this.id(), null)
      .subscribe({
        next: (res: Note[]) => {
          this.notesForMember.set(res);
        },
        error: () => {},
        complete: () => {},
      });
  }

  getFilteredNotes() {
    const notes = this.notesForMember();
    if (!notes) return [];

    const term = this.searchTermNotes.toLowerCase().trim();
    if (!term) return notes;

    return notes.filter((n) => {
      const title = n.content.toLowerCase();
      return title.includes(term);
    });
  }

  getMemberBeltExams() {
    this.memberService.getMemberBeltExams(+this.id()).subscribe({
      next: (res: any) => {
        this.memberBeltExams.set(res);
      },
      error: () => {},
    });
  }

  addBeltForMember() {
    const dialogRef = this.dialog.open(AddBeltComponent, {
      width: '400px',
      data: { date: new Date(), memberId: this.id() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.memberService.addMemberBeltExam(result).subscribe({
          next: (res) => {
            this.toast.success('Успешно додадовте полагање за појас');
            this.getMemberBeltExams();
          },
        });
      } else {
        console.log('Dialog closed without adding note.');
      }
    });
  }

  addNoteForMember() {
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: '400px',
      data: { date: new Date() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        var note: AddNote = {
          title: result.title,
          content: result.content,
          createdAt: new Date(),
          fromMemberId: 0,
          toMemberId: +this.id(),
          trainingId: null,
          priority:
            result.priority == null || result.priority == ''
              ? 1
              : result.priority,
        };

        this.noteService.addNote(note).subscribe({
          next: () => {
            this.toast.success('Белешката е креирана');
            this.getNotesForMember();
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        console.log('Dialog closed without adding note.');
      }
    });
  }

  deleteMemberBeltExam(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        questionTitle: 'Дали сте сигурни?',
        questionBody:
          'Оваа операција ќе го избрише полагањето.Дали сте сигурни дека го сакате тоа?',
      },
    });

    dialogRef.beforeClosed().subscribe((res) => {
      if (res) {
        this.memberService.deleteMemberBeltExam(id).subscribe({
          next: (res: any) => {
            this.toast.success(res.message);
            this.getMemberBeltExams();
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
      }
    });
  }

  deleteNoteForMember(id: string) {
    this.noteService.deleteNote(+id).subscribe({
      next: () => {
        this.toast.success('Белешката е избришана');
        this.getNotesForMember();
      },
      error: () => {},
    });
  }
}
