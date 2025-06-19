import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Member } from '../../_models/Member';
import { MemberTrainingData } from '../../_models/MemberTrainingData';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMember(id: number) {
    return this.http.get<Member>(this.baseUrl + `members/${id}`);
  }
  getMemberTrainingData(id: number) {
    return this.http.get<MemberTrainingData[]>(
      this.baseUrl + `members/memberTraningData/${id}`
    );
  }
}
