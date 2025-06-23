import { Component } from '@angular/core';
import { Note } from '../../../_models/Note';
import { MatDialog } from '@angular/material/dialog';
import { NoteComponent } from '../note/note.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-list',
  imports: [NoteComponent,CommonModule,FormsModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css',
})
export class NoteListComponent {
 notes: Note[] = [
    {title:'Note1',content:'Note 1 desc',createdAt:new Date(),category:'For me', fromMemberId:1,toMemberId:2}
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
}
