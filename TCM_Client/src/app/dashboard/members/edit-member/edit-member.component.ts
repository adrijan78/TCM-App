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
import { MatSelectModule } from '@angular/material/select';
import { Member } from '../../../_models/Member';
import { HttpClient } from '@angular/common/http';
import { MemberService } from '../../../_services/member/member.service';
import { AcountService } from '../../../_services/account/acount.service';
import { Role } from '../../../_models/Role';

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
  accountService = inject(AcountService);
  id = input.required<number>();
  editForm: FormGroup;
  selectedMember = signal<Member | null>(null);
  imagePreview: string | ArrayBuffer | null = null;
  selectedRole: string = '';
  roles = signal<Role[] | null>(null);

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      dateOfBirth: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      role: ['', Validators.required],
      photo: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getUserToEdit();
    this.getRoles();
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
      next: (res) => {
        this.selectedMember.set(res);
      },
      error: () => {},
    });
  }

  compareRoles(r1: Role, r2: Role): boolean {
    return r1 && r2 && r1.id === r2.id;
  }

  onFileSelected(event: Event): void {
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

  removeImage(): void {
    this.imagePreview = null;
    this.editForm.patchValue({ photo: null });
  }

  onSubmit() {
    this.memberService.editMember(this.selectedMember()!).subscribe({
      next: (res: any) => {
        console.log('Response', res);
      },
    });
  }
}
