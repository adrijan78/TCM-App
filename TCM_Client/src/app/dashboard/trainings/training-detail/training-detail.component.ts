import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Training, TrainingDetails } from '../../../_models/Training';
import { TrainingService } from '../../../_services/training/training.service';
import { DatePipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { NoteComponent } from '../../notes/note/note.component';
import { NoteService } from '../../../_services/note/note.service';
import { MemberTrainingData } from '../../../_models/MemberTrainingData';
import { Note } from '../../../_models/Note';
import { AttendanceMkName } from '../../../_mappings/attendanceStatusMapping';
import { AttendanceStatus } from '../../../_models/_enums/AttendanceStatus';
import { MatSelectModule } from '@angular/material/select';
import { MemberService } from '../../../_services/member/member.service';
import { AcountService } from '../../../_services/account/acount.service';
import { MatDialog } from '@angular/material/dialog';
import { AddNoteComponent } from '../../notes/add-note/add-note.component';
import { AddNote } from '../../../_models/_enums/AddNote';
import { ToastrService } from 'ngx-toastr';

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
    MatSelectModule,
  ],
  templateUrl: './training-detail.component.html',
  styleUrl: './training-detail.component.css',
})
export class TrainingDetailComponent implements OnInit {
  id = input.required<number>();
  trainingService = inject(TrainingService);
  toast = inject(ToastrService);
  noteService = inject(NoteService);
  memberService = inject(MemberService);
  accountService = inject(AcountService);
  training = signal<TrainingDetails | null>(null);
  searchTermCalendar: string = '';
  searchTermNotes: string = '';
  notesForMember = signal<Note[] | null>(null);
  attendaceNames = AttendanceMkName;
  inEditMode = signal<boolean>(false);
  AttendanceStatus = AttendanceStatus;
  panel = viewChildren<MatExpansionPanel>('panel');
  selectedMemberId = signal<number>(0);

  constructor(private dialog: MatDialog) {
    effect(() => {
      const panel = this.panel();
      if (!this.inEditMode()) {
        panel?.forEach((x) => x.close());
      }
    });
  }

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

  getNotesForMember() {
    this.noteService
      .getNotesForMember(1, this.selectedMemberId(), this.training()!.id)
      .subscribe({
        next: (res: Note[]) => {
          this.notesForMember.set(res);
        },
        error: () => {},
        complete: () => {},
      });
  }

  onMemberSelect(memberTraining: MemberTrainingData) {
    this.selectedMemberId.set(memberTraining.memberId);
    this.getNotesForMember();
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

  addNoteForMemberAttendance() {
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
          toMemberId: this.selectedMemberId(),
          trainingId: this.training()!.id,
          priority:
            result.priority == null || result.priority == ''
              ? 1
              : result.priority,
        };

        if (
          this.notesForMember() != null &&
          this.notesForMember()!.length > 1
        ) {
          // this.notesForMember.update((arr) => [note, ...arr!]);
        } else {
          // this.notesForMember.set([note]);
        }
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

  deleteNoteForMemberAttendance(id: string) {
    this.noteService.deleteNote(+id).subscribe({
      next: () => {
        this.toast.success('Белешката е избришана');
        this.getNotesForMember();
      },
      error: () => {},
    });
  }

  updateMembersAttendanceStatusAndPerformance() {
    var membersUpdated = this.training()!.memberTrainings.map((x) => {
      return {
        id: x.id,
        description: x.description,
        performance: x.performace,
        status: x.status,
      };
    });
    this.memberService
      .updateMembersAttendanceStatusAndPerformance(membersUpdated)
      .subscribe({
        next: (response: any) => {
          console.log('Response: ', response);
          this.inEditMode.set(false);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
