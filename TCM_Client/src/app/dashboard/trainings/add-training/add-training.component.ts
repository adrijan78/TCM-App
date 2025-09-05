import { CommonModule } from '@angular/common';
import { Component, inject, Inject, signal, viewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrainingService } from '../../../_services/training/training.service';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MemberTrainingData } from '../../../_models/MemberTrainingData';
import { MemberService } from '../../../_services/member/member.service';
import { BeltMkName } from '../../../_mappings/beltMapping';
import { AcountService } from '../../../_services/account/acount.service';
import { TrainingStatus } from '../../../_models/_enums/TrainingStatus';
import { MatPseudoCheckbox } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';

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
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.css',
})
export class AddTrainingComponent {
  fb = inject(FormBuilder);
  toast = inject(ToastrService);
  trainingService = inject(TrainingService);
  membersService = inject(MemberService);
  accountService = inject(AcountService);
  trainingTypes = signal<any>([]);
  trainingMembers = signal<any>([]);

  membersSelect = viewChild.required<MatSelect>('membersSelect');
  addTraingingForm: FormGroup;
  beltMkNames = BeltMkName;
  allSelected = false;
  constructor(
    public dialogRef: MatDialogRef<AddTrainingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTrainingData
  ) {
    this.addTraingingForm = this.fb.group({
      trainingTitle: ['', [Validators.required, Validators.maxLength(50)]],
      trainingType: ['', [Validators.required]],
      trainingNotes: ['', [Validators.maxLength(200)]],
      trainingMembersCtrl: ['', [Validators.required]],
      trainingDateCtrl: [this.data.date, Validators.required],
    });
  }

  ngOnInit(): void {
    // You could pre-fill if editing an existing training, but for now, it's for adding.
    this.getTrainingTypes();
    this.getTrainingMembers();
  }

  getTrainingTypes() {
    this.trainingService.getTrainingTypes().subscribe({
      next: (res: any) => {
        this.trainingTypes.set(res);
      },
    });
  }

  getTrainingMembers() {
    this.membersService.getMembersGroupedByBelt().subscribe({
      next: (res: any) => {
        this.trainingMembers.set(res);
        this.transformDictionaryToArray();
        console.log(this.trainingMembers());
      },
      error: () => {},
      complete: () => {},
    });
  }

  transformDictionaryToArray() {
    var temp = Object.entries(this.trainingMembers()).map(
      ([beltId, members]) => ({
        beltId,
        members: members,
      })
    );
    this.trainingMembers.set(temp);
  }

  toggleAllSelection() {
    this.allSelected = !this.allSelected;

    this.membersSelect()?.options.forEach((o) => {
      if (o.value != null || o.value != undefined) {
        if (this.allSelected) {
          o.select();
        } else {
          o.deselect();
        }
      }
    });

    console.log('Members:', this.addTraingingForm.value.trainingMembersCtrl);
  }

  // Transform Dictionary -> Array

  onSave(): void {
    var selectedDate = new Date(this.addTraingingForm.value.trainingDateCtrl);
    selectedDate = new Date(selectedDate.setDate(selectedDate.getDate() + 1));
    if (this.addTraingingForm.valid) {
      var training = {
        date: selectedDate,
        description: this.addTraingingForm.value.trainingTitle,
        //This I will get from identity
        memberId: 0,
        status: 1,
        clubId: 1,
        trainingType: this.addTraingingForm.value.trainingType,
        membersToAttend: this.addTraingingForm.value.trainingMembersCtrl.map(
          (x: any) => {
            if (x != undefined) {
              return {
                date: selectedDate,
                description: '',
                memberId: x.id,
                clubId: 1,
                performace: 0,
                status: 1,
              };
            } else {
              return;
            }
          }
        ),
      };

      this.trainingService.createTraining(training).subscribe({
        next: (res) => {
          console.log(res);
          this.toast.success('Тренингот беше успрешно додаден');
          this.dialogRef.close();
        },
        error: (err) => {
          console.log(err);
        },
      });

      // this.dialogRef.close({
      //   date: this.data.date,
      //   title: this.trainingTitle.value,
      //   notes: this.trainingNotes.value,
      // });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
