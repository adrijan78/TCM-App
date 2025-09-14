import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { SharedService } from '../../../../../_services/shared.service';
import { Belt } from '../../../../../_models/Belt';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  AddTrainingComponent,
  AddTrainingData,
} from '../../../../trainings/add-training/add-training.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-belt',
  imports: [
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
  ],
  templateUrl: './add-belt.component.html',
  styleUrl: './add-belt.component.css',
})
export class AddBeltComponent implements OnInit {
  sharedService = inject(SharedService);
  fb = inject(FormBuilder);
  toast = inject(ToastrService);
  addBeltForm: FormGroup;
  clubBelts = signal<Belt[]>([]);

  constructor(
    public dialogRef: MatDialogRef<AddTrainingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addBeltForm = this.fb.group({
      belt: ['', [Validators.required]],
      dateReceived: ['', [Validators.required]],
      isCurrentBelt: [false, [Validators.required]],
      description: [''],
    });
  }
  ngOnInit(): void {
    this.getBelts();
  }

  getBelts() {
    this.sharedService.getClubBelts().subscribe({
      next: (res: any) => {
        this.clubBelts.set(res);
      },
      error: (err) => {
        this.toast.error(err);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    let beltAccomplished = {
      beltId: this.addBeltForm.value.belt,
      memberId: this.data.memberId,
      earnedOn: new Date(this.addBeltForm.value.dateReceived),
      description: this.addBeltForm.value.description,
      isCurrentBelt: this.addBeltForm.value.isCurrentBelt,
    };

    this.dialogRef.close(beltAccomplished);
  }
}
