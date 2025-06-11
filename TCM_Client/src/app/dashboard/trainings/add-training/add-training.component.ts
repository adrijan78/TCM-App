import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AddTrainingData {
  date: Date;
}

@Component({
  selector: 'app-add-training',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.css',
})
export class AddTrainingComponent {
  trainingTitle = new FormControl('', Validators.required);
  trainingNotes = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<AddTrainingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTrainingData
  ) {}

  ngOnInit(): void {
    // You could pre-fill if editing an existing training, but for now, it's for adding.
  }

  onSave(): void {
    if (this.trainingTitle.valid) {
      this.dialogRef.close({
        date: this.data.date,
        title: this.trainingTitle.value,
        notes: this.trainingNotes.value,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
