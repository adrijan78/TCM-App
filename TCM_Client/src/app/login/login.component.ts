import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AcountService } from '../_services/account/acount.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private accountService = inject(AcountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  loggedIn = false;
  model: any = {};
  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => {
        console.log(response);
        this.accountService.isLoggedIn.set(true);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status == 0) {
          this.toastr.error(
            'A problem occured in the login proccess.Please try again later!'
          );
        } else {
          this.toastr.error(err.error.message);
        }

        console.log(err);
      },
      complete: () => {},
    });
  }
}
