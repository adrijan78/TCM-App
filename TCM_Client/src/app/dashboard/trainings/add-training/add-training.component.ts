import { CommonModule } from '@angular/common';
import { Component, inject, Inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrainingService } from '../../../_services/training/training.service';
import { MatSelectModule } from '@angular/material/select';
import { MemberTrainingData } from '../../../_models/MemberTrainingData';

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
    MatSelectModule
  ],
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.css',
})
export class AddTrainingComponent {
  trainingService = inject(TrainingService);
  trainingTitle = new FormControl('', Validators.required);
  trainingType = new FormControl('', Validators.required);
  trainingNotes = new FormControl('');
  trainingTypes=signal<any>([]);

  constructor(
    public dialogRef: MatDialogRef<AddTrainingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTrainingData
  ) {}

  ngOnInit(): void {
    // You could pre-fill if editing an existing training, but for now, it's for adding.
    this.getTrainingTypes();
  }

  getTrainingTypes(){
    this.trainingService.getTrainingTypes().subscribe({
      next:(res:any)=>{
        this.trainingTypes.set(res);
      }
    })
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
