import { NgFor, NgIf } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { EditMember, Member } from '../../../_models/Member';
import { HttpClient } from '@angular/common/http';
import { MemberService } from '../../../_services/member/member.service';
import { AcountService } from '../../../_services/account/acount.service';
import { Role } from '../../../_models/Role';
import { Router } from '@angular/router';
import { Belt } from '../../../_models/Belt';
import { SharedService } from '../../../_services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-member',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    NgIf,
    MatFormFieldModule,
    NgFor,
  ],
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.css',
})
export class EditMemberComponent implements OnInit {
  memberService = inject(MemberService);
  sharedService = inject(SharedService);
  accountService = inject(AcountService);
  router = inject(Router);
  toastr = inject(ToastrService);
  id = input.required<number>();
  editForm: FormGroup;
  selectedMember = signal<EditMember | null>(null);
  imagePreview: string | ArrayBuffer | null = null;
  selectedRole: string = '';
  roles = signal<Role[] | null>(null);
  formData = new FormData();
  clubBelts = signal<Belt[]>([]);

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      firstName: [
        this.selectedMember()?.firstName,
        [Validators.required, Validators.maxLength(50)],
      ],
      lastName: [
        this.selectedMember()?.lastName,
        [Validators.required, Validators.maxLength(50)],
      ],
      email: [
        this.selectedMember()?.email,
        [Validators.required, Validators.email],
      ],
      dateOfBirth: [this.selectedMember()?.dateOfBirth, Validators.required],
      height: [this.selectedMember()?.height, Validators.required],
      weight: [this.selectedMember()?.weight, Validators.required],
      role: [this.selectedMember()?.rolesIds, Validators.required],
      photo: [this.selectedMember()?.photoId, Validators.required],
      belt: [this.selectedMember()?.currentBelt, Validators.required],
    });
  }
  ngOnInit(): void {
    this.getUserToEdit();
    this.getRoles();
    this.getBelts();
  }

  getRoles() {
    this.accountService.getAppRoles().subscribe({
      next: (res: any) => {
        this.roles.set(res);
      },
      error: () => {},
      complete: () => {},
    });
  }

  getUserToEdit() {
    this.memberService.getMember(this.id()).subscribe({
      next: (member: any) => {
        this.selectedMember.set(member);
        this.editForm.patchValue({
          firstName: member.firstName,
          lastName: member.lastName,
          dateOfBirth: member.dateOfBirth,
          height: member.height,
          weight: member.weight,
          role: member.rolesIds,
          photo: member.photoId,
          belt: member.currentBelt,
          email: member.email,
        });
      },
      error: () => {},
    });
  }

  getBelts() {
    this.sharedService.getClubBelts().subscribe({
      next: (res: any) => {
        this.clubBelts.set(res);
      },
      error: (err) => {
        this.toastr.error(err);
      },
    });
  }

  compareRoles(r1: Role, r2: Role): boolean {
    return r1 && r2 && r1.id === r2.id;
  }
  compareBelts(r1: Belt, r2: Belt): boolean {
    return r1 && r2 && r1.id === r2.id;
  }

  onFileSelected(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.editForm.patchValue({ photo: file });
      };
      reader.readAsDataURL(file);
    }
  }

  OnRoleSelect(event: MatSelectChange<any>) {
    var arr: any[] = [];
    this.formData.delete('rolesIds');
    for (var val of event.value) {
      this.formData.append(`rolesIds`, val.id.toString());
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.editForm.patchValue({ photo: null });
  }

  onSubmit() {
    var dob;
    this.formData.append('firstName', this.editForm.value.firstName);
    this.formData.append('lastName', this.editForm.value.lastName);
    this.formData.append('height', this.editForm.value.height);
    this.formData.append('weight', this.editForm.value.weight);
    this.formData.append('newPhoto', this.editForm.value.photo);
    this.formData.append('currentBeltId', this.editForm.value.belt.id);
    this.formData.append('email', this.editForm.value.email);
    if (typeof this.editForm.value.dateOfBirth == 'string') {
      const iso = new Date(this.editForm.value.dateOfBirth).toISOString();
      this.formData.append('dateOfBirth', iso);
    } else {
      const iso = this.editForm.value.dateOfBirth.toISOString(); // e.g. "2025-06-09T22:00:00.000Z"
      this.formData.append('dateOfBirth', iso);
    }

    this.memberService
      .editMember(this.selectedMember()?.id, this.formData)
      .subscribe({
        next: (res: any) => {
          this.router.navigate(['members', this.id()]);
          console.log('Response', res);
        },
      });
  }
}
