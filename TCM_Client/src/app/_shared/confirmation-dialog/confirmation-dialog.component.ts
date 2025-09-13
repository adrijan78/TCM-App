import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface ConfirmationDialogData {
  questionTitle?: string;
  questionBody?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  questionTitle: string;
  questionBody: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    this.questionTitle = data?.questionTitle || 'Дали сте сигурни?';
    this.questionBody =
      data?.questionBody || 'Оваа операција ќе го избрише записот';
  }

  onConfirm() {
    this.dialogRef.close(true); // yes
  }

  onCancel() {
    this.dialogRef.close(false); // no
  }
}
