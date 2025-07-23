import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AcountService } from '../../_services/account/acount.service';
import { ToastrService } from 'ngx-toastr';
import { RegisterMember } from '../../_models/RegisterMember';
import { MatSelectModule } from '@angular/material/select';
import { Belt } from '../../_models/Belt';
import { SharedService } from '../../_services/shared.service';

@Component({
  selector: 'app-register-member',
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
    FormsModule
  ],
  templateUrl: './register-member.component.html',
  styleUrl: './register-member.component.css',
})
export class RegisterMemberComponent implements OnInit {
  accountService = inject(AcountService);
  sharedService = inject(SharedService);
  toastr = inject(ToastrService);
  registerForm: FormGroup;
  // selectedFile: File | null = null;
  memberToRegister: RegisterMember={} as RegisterMember;
  selectedRole: string='';
  selectedBelt: string='';
  clubBelts=signal<Belt[]>([]);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      role: ['', Validators.required],
      belt:['',Validators.required]
    });
  }
  ngOnInit(): void {
    this.getBelts();
  }

  getBelts(){
    this.sharedService.getClubBelts().subscribe({
      next:(res:any)=>{
        this.clubBelts.set(res)
      },
      error:(err)=>{
        this.toastr.error(err)
      }
    })
  }

  // onFileSelected(event: Event) {
  //   event.preventDefault();
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.selectedFile = input.files[0];
  //   }
  // }
  onSubmit(): void {
    if (this.registerForm.valid) {
      // const formData = new FormData();
      // formData.append('firstName', this.registerForm.value.firstName);
      // formData.append('lastName', this.registerForm.value.lastName);
      // formData.append('email', this.registerForm.value.email);
      // formData.append('password', this.registerForm.value.password);
      // formData.append(
      //   'dateOfBirth',
      //   this.registerForm.value.dateOfBirth.toISOString()
      // );

      this.memberToRegister.firstName = this.registerForm.value.firstName;
      this.memberToRegister.lastName = this.registerForm.value.lastName;
      this.memberToRegister.email = this.registerForm.value.email;
      this.memberToRegister.password = this.registerForm.value.password;
      this.memberToRegister.dateOfBirth = this.registerForm.value.dateOfBirth;
      this.memberToRegister.weight = this.registerForm.value.weight;
      this.memberToRegister.height = this.registerForm.value.height;
      this.memberToRegister.belt=this.registerForm.value.belt;
      debugger;
      this.memberToRegister.rolesIds=[]
      this.memberToRegister.rolesIds.push(+this.selectedRole)

      // if (this.selectedFile) {
      //   formData.append('profilePicture', this.selectedFile);
      // }

      // TODO: Send `formData` to your API via HTTP
      this.accountService.registerMember(this.memberToRegister).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message);
          this.registerForm.reset();
        },
        error: (err) => {
          this.toastr.error(err.error);
        },
        complete: () => {},
      });
    }
  }
}
