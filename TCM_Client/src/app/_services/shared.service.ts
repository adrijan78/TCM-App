import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs/operators';
import { ProfilePicture } from './../_models/ProfilePicture';
import { DropDownMember } from '../_models/Member';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private router = inject(Router);
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  clubMembers: DropDownMember[] = [];

  getClubBelts() {
    return this.http.get(this.baseUrl + 'common/belts');
  }

  getClubMembers() {
    return this.http.get(this.baseUrl + 'common/members');
  }

  getClubNumberOfTrainings(year: number, month: number | null) {
    var params = new HttpParams();
    params = params.append('year', year);
    if (month) {
      params = params.append('month', month);
    }
    return this.http.get(this.baseUrl + 'common/number-of-trainings', {
      params,
    });
  }

  getClubMembersForDropdown() {
    return this.http.get(this.baseUrl + 'common/members').pipe(
      // map((members: any) => members as DropDownMember[]
      // ),
      map((members: any) => {
        return members.map((member: any) => ({
          ...member,
          name: member.firstName + ' ' + member.lastName,
          profilePicture: member.profilePicture
            ? member.profilePicture.url
            : 'assets/user.png',
        }));
      })
    );
  }

  getClubNumbersInfo(year: number, month: number | null = null) {
    var params = new HttpParams();
    params = params.append('year', year);
    if (month) {
      params = params.append('month', month);
    }
    return this.http.get(this.baseUrl + 'common/club-numbers-info', { params });
  }

  getClubTrainingsAttendance(year: number, month: number | null = null) {
    var params = new HttpParams();
    params = params.append('year', year);
    if (month) {
      params = params.append('month', month);
    }
    return this.http.get(this.baseUrl + 'common/club-trainings-attendance', {
      params,
    });
  }
}
