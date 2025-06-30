import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Training, TrainingDetails } from '../../../_models/Training';
import { TrainingService } from '../../../_services/training/training.service';
import { DatePipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { NoteComponent } from '../../notes/note/note.component';
import { NoteService } from '../../../_services/note/note.service';
import { MemberTrainingData } from '../../../_models/MemberTrainingData';
import { Note } from '../../../_models/Note';

@Component({
  selector: 'app-training-detail',
  imports: [
    DatePipe,
    MatIconModule,
    NgIf,
    MatExpansionModule,
    RouterModule,
    FormsModule,
    MatInputModule,
    NoteComponent,
  ],
  templateUrl: './training-detail.component.html',
  styleUrl: './training-detail.component.css',
})
export class TrainingDetailComponent implements OnInit {
  id = input.required<number>();
  trainingService = inject(TrainingService);
  noteService = inject(NoteService);
  training = signal<TrainingDetails | null>(null);
  searchTermCalendar: string = '';
  searchTermNotes: string = '';
  notesForMember = signal<Note[] | null>(null);

  ngOnInit(): void {
    if (this.id() != null) this.getTrainingDetails();
  }

  getTrainingDetails() {
    this.trainingService.getTraining(this.id()!).subscribe({
      next: (res: TrainingDetails) => {
        this.training.set(res);
      },
    });
  }

  onMemberSelect(memberTraining: MemberTrainingData) {
    this.noteService
      .getNotesForMember(
        memberTraining.training.date.toString(),
        1,
        memberTraining.memberId,
        true
      )
      .subscribe({
        next: (res: Note[]) => {
          this.notesForMember.set(res);
        },
        error: () => {},
        complete: () => {},
      });
  }

  getFilteredMembers() {
    const training = this.training();
    if (!training || !training.memberTrainings) return [];

    const term = this.searchTermCalendar.toLowerCase().trim();
    if (!term) return training.memberTrainings;

    return training.memberTrainings.filter((m) => {
      const fullName = (
        m.member.firstName +
        ' ' +
        m.member.lastName
      ).toLowerCase();
      return fullName.includes(term);
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
}
