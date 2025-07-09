import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginMember, Member } from '../../_models/Member';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AcountService {
  private router = inject(Router);
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  isLoggedIn = signal(false);
  currentUser = signal<LoginMember | null>(null);

  constructor() {
    // const member = localStorage.getItem('member');
    // if (member) {
    //   this.currentUser.set(JSON.parse(member));
    // }

    this.setCurrentUser();
  }

  setCurrentUser() {
    const memberString = localStorage.getItem('member');
    if (!memberString) {
      this.router.navigate(['/login']);
    } else {
      this.currentUser.set(JSON.parse(memberString));
    }
  }

  //isLoggedIn=this._isLoggedIn.asReadonly();

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((member: any) => {
        debugger;
        if (member) {
          localStorage.setItem('member', JSON.stringify(member.data));
          this.currentUser.set(member);
        }
      })
    );
  }

  registerMember(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model);
  }

  getAppRoles() {
    return this.http.get(this.baseUrl + 'roles');
  }

  logout() {
    localStorage.removeItem('member');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
