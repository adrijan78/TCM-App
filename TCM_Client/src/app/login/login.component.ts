import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AcountService } from '../_services/account/acount.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    NgIf,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private accountService = inject(AcountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  loggedIn = false;
  isLoading = signal<boolean>(false);
  model: any = {};
  login() {
    this.isLoading.set(true);
    this.accountService
      .login(this.model)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          console.log(response);

          this.accountService.getStripePriceId().subscribe({
            next: (res: any) => {
              localStorage.setItem('priceId', res.priceId);
            },
          });

          this.accountService.isLoggedIn.set(true);
          this.router.navigate(['/club-details']);
        },
        error: (err) => {
          if (err.status == 0) {
            this.toastr.error(
              'A problem occured in the login proccess.Please try again later!'
            );
          } else {
            //this.toastr.error(err.error.message);
          }

          console.log(err);
        },
      });
  }
}
