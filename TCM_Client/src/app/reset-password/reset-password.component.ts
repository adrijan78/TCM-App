import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AcountService } from '../_services/account/acount.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    CommonModule,
    MatFormField,
    MatCardModule,
    MatInputModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  toast = inject(ToastrService);
  accountService = inject(AcountService);
  token = '';
  email = '';

  model: any = { password: '', confirmPassword: '' };

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
  }

  resetPassword() {
    var data = {
      email: this.email,
      password: this.model.password,
      confirmPassword: this.model.confirmPassword,
      token: this.token,
    };
    this.accountService.onResetPasswordClicked(data).subscribe({
      next: (response: any) => {
        console.log(response);
        this.router.navigate(['/login']);
        this.toast.success(
          'Успешно ја ресетиравте на лозинката, можете да се најавите сега'
        );
      },
      error: (error: any) => {
        this.toast.error('Неуспешно ресетирање на лозинка');
        console.log(error);
      },
    });
  }
}
