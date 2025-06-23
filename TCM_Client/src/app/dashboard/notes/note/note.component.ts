import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent {
  notes: string[] = [
    'Stretch before training',
    'Prepare grading materials',
    'Remind team: sparring gear',
  ];

  newNote: string = '';

  addNote() {
    if (this.newNote.trim()) {
      this.notes.unshift(this.newNote.trim());
      this.newNote = '';
    }
  }

  deleteNote(index: number) {
    this.notes.splice(index, 1);
  }
}
