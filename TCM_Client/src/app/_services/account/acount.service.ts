import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from '../../_models/Member';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AcountService {
  private router = inject(Router);
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:7292/api/';
  isLoggedIn = signal(false);
  currentUser = signal<Member | null>(null);

  //isLoggedIn=this._isLoggedIn.asReadonly();

  login(model: any) {
    return this.http.post<Member>(this.baseUrl + 'account/login', model).pipe(
      map((member) => {
        if (member) {
          localStorage.setItem('member', JSON.stringify(member));
          this.currentUser.set(member);
        }
      })
    );
  }

  registerMember(model: any) {
    return this.http.post(this.baseUrl + 'account/register-member', model);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
