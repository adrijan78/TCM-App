import { Component } from '@angular/core';
import { Note } from '../../../_models/Note';
import { MatDialog } from '@angular/material/dialog';
import { NoteComponent } from '../note/note.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddNoteComponent } from '../add-note/add-note.component';

@Component({
  selector: 'app-note-list',
  imports: [NoteComponent, CommonModule, FormsModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css',
})
export class NoteListComponent {
  notes: Note[] = [
    {
      id: 'FE-19',
      title: 'Note1',
      content: 'Note 1 desc',
      createdAt: new Date(),
      fromMemberId: 1,
      toMemberId: 2,
      createdForTraining: false,
    },
  ];

  constructor(private dialog: MatDialog) {}

  newNote: string = '';

  addNote() {
    // if (this.newNote.trim()) {
    //   this.notes.unshift(this.newNote.trim());
    //   this.newNote = '';
    // }
  }

  deleteNote(index: number) {
    this.notes.splice(index, 1);
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
      data: { date: new Date() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.trainings.update((r) => [result]);
        // this.trainings()?.sort((a, b) => a.date.getTime() - b.date.getTime());
        // Angular's change detection will automatically re-render the calendar
        // because the 'trainings' array, which 'dateClass' depends on, has changed.
      } else {
        console.log('Dialog closed without adding training.');
      }
    });
  }
}
