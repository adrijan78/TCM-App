import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Note } from '../../../_models/Note';

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
  providers: [DatePipe],
})
export class NoteComponent implements OnInit {
  @Output() deleteClicked = new EventEmitter<void>();
  note = input<Note | null>(null);
  dateFormated: any;

  constructor(private datePipe: DatePipe) {}
  ngOnInit(): void {
    this.dateFormated = this.datePipe.transform(
      this.note()?.createdAt,
      'dd/MM/yyyy'
    );
  }

  onDeleteClicked() {
    this.deleteClicked.emit();
  }
}
