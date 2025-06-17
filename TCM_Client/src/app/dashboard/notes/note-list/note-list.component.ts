import { Component } from '@angular/core';
import { Note } from '../../../_models/Note';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-note-list',
  imports: [],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {
   
  notes: Note[] = [
    {
      title: 'Kicks Practice',
      content: 'Keep up the great work on your kicks!',
      category: 'Technique',
      createdAt: new Date('2023-05-11'),
      fromMemberId: 1,
      toMemberId: 2
    }
    // Add more notes here or load from API
  ];

  constructor(private dialog: MatDialog) {}

  openAddNoteDialog() {
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
  }

}
