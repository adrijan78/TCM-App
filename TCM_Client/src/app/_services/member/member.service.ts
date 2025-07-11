import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { EditMember, Member } from '../../_models/Member';
import { MemberTrainingData } from '../../_models/MemberTrainingData';
import { PaginationResult } from '../../_models/Pagination';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getMembers(
    pageNumber?: number,
    pageSize?: number,
    belt?: string,
    ageCategory?: number | null,
    searchTerm?: string
  ) {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    if (belt != undefined || belt != null || belt != '') {
      params = params.append('belt', belt!);
    }
    if (ageCategory != null) {
      params = params.append('memberAgeCategorie', ageCategory);
    }
    if (searchTerm != '') {
      params = params.append('searchTerm', searchTerm!);
    }

    return this.http.get<PaginationResult<Member[]>>(this.baseUrl + 'members', {
      observe: 'response',
      params,
    });
  }

  getMember(id: number) {
    return this.http.get<Member>(this.baseUrl + `members/${id}`);
  }
  getMemberTrainingData(id: number, pageNumber?: number, pageSize?: number) {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return this.http.get<MemberTrainingData[]>(
      this.baseUrl + `members/memberTraningData/${id}`,
      { observe: 'response', params }
    );
  }

  editMember(memberId:any,member: FormData) {
    return this.http.put(
      this.baseUrl + 'members/edit-member/' + memberId,
      member
    );
  }

  deactivateMember(id: number) {
    return this.http.delete(this.baseUrl + 'members/deactivate-member/' + id);
  }
}
