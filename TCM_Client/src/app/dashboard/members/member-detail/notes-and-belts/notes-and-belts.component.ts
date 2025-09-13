import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
export class NotesAndBeltsComponent {
  route = inject(ActivatedRoute);
  id = signal<number | string>(0);
  noteService = inject(NoteService);
  toast = inject(ToastrService);
  notesForMember = signal<Note[] | null>(null);
  searchTermNotes: string = '';

  constructor(private dialog: MatDialog) {
    this.id.set(this.route.snapshot.paramMap.get('id')!);
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
          priority: 1,
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
