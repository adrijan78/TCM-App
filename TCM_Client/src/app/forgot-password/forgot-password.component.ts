import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcountService } from '../_services/account/acount.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-forgot-password',
  imports: [MatInputModule, MatCardModule, CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  accountService = inject(AcountService);
  router = inject(Router);
  toast = inject(ToastrService);
  model = {
    email: '',
  };

  isLoading = signal(false);

  sendResetLink() {
    var forgotPasswordData = {
      email: this.model.email,
      clientUri: environment.clientUri + 'reset-password',
    };

    this.accountService.onForgotPasswordClicked(forgotPasswordData).subscribe({
      next: (response) => {
        this.toast.success(
          'Проверете ја вашата е-пошта за инструкции за ресетирање на лозинка.'
        );
        console.log('Reset link sent successfully', response);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.toast.error(
          'Настана грешка при испраќање на линкот за ресетирање.'
        );
        console.error('Error sending reset link', error.error);
        this.isLoading.set(false);
      },
    });
  }
}
