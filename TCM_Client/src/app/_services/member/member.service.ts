import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Member } from '../../_models/Member';
import { AcountService } from '../account/acount.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private accountService = inject(AcountService);
  baseUrl = environment.apiUrl;

  getMembers() {
    return this.http.get<Member[]>(
      this.baseUrl + 'members',
      this.getHttpOptions()
    );
  }

  getMember(id: number) {
    return this.http.get<Member>(
      this.baseUrl + `members/${id}`,
      this.getHttpOptions()
    );
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.accountService.currentUser()?.token}`,
      }),
    };
  }
}
