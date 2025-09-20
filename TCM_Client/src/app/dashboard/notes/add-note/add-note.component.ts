import { Component, inject, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DropDownMember } from '../../../_models/Member';
import { SharedService } from '../../../_services/shared.service';

@Component({
  selector: 'app-add-note',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.css',
})
export class AddNoteComponent {
  fb = inject(FormBuilder);
  sharedService = inject(SharedService);
  addNoteForm: FormGroup;
  clubMembers = this.sharedService.clubMembers;

  constructor(
    public dialogRef: MatDialogRef<AddNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addNoteForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(30)]],
      content: ['', [Validators.required, Validators.maxLength(50)]],
      priority: [''],
    });

    if (data.isFromNoteList) {
      this.addNoteForm.addControl(
        'toMember',
        this.fb.control(null, Validators.required)
      );
    }
  }

  onSend() {
    if (this.addNoteForm.valid) this.dialogRef.close(this.addNoteForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
