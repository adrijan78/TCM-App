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
  beltChanged = signal<number>(0);
  memberStartedOn: Date | null = null;

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
  getMemberTrainingData(
    id: number,
    year: number,
    pageNumber?: number,
    pageSize?: number
  ) {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
      params = params.append('year', year);
    }
    return this.http.get<MemberTrainingData[]>(
      this.baseUrl + `members/memberTraningData/${id}`,
      { observe: 'response', params }
    );
  }

  updateMembersAttendanceStatusAndPerformance(membersList: any) {
    return this.http.put(
      this.baseUrl + 'members/updateMembersAttendance',
      membersList
    );
  }

  editMember(memberId: any, member: FormData) {
    return this.http.put(
      this.baseUrl + 'members/edit-member/' + memberId,
      member
    );
  }

  getNumberOfTrainingsForMember(
    year: number,
    dateStarted: string,
    month?: number | null
  ) {
    let params = new HttpParams();
    params = params.append('year', year);
    params = params.append('dateStarted', dateStarted);
    if (month) {
      params = params.append('month', month);
    }
    return this.http.get<number>(
      this.baseUrl + 'common/number-of-trainings-for-member',
      { params }
    );
  }

  reloadMemberDataAfterBeltChange(beltId: number) {
    this.beltChanged.set(beltId);
  }

  getMemberBeltExams(id: number) {
    return this.http.get(this.baseUrl + 'members/member-belts/' + id);
  }

  deactivateMember(id: number) {
    return this.http.delete(this.baseUrl + 'members/deactivate-member/' + id);
  }

  getMembersGroupedByBelt() {
    return this.http.get(this.baseUrl + 'members/membersGroupedByBelt');
  }

  addMemberBeltExam(exam: any) {
    return this.http.post(this.baseUrl + 'members/add-belt-exam', exam);
  }

  getMemberPayments(id: number, pageNumber?: number, pageSize?: number) {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return this.http.get(this.baseUrl + 'members/member-payments/' + id, {
      observe: 'response',
      params,
    });
  }

  getMembersPayments(
    pageNumber?: number,
    pageSize?: number,
    memberId?: number | null,
    paymentType?: boolean | null,
    paymentMonth?: number | null,
    paymentYear?: number | null
  ) {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    if (memberId != null) {
      params = params.append('memberId', memberId);
    }
    if (paymentType != null) {
      params = params.append('paymentType', paymentType);
    }
    if (paymentMonth != null) {
      params = params.append('paymentMonth', paymentMonth);
    }
    if (paymentYear != null) {
      params = params.append('paymentYear', paymentYear);
    }

    return this.http.get(this.baseUrl + 'members/members-payments', {
      observe: 'response',
      params,
    });
  }

  deleteMemberPayment(id: number) {
    return this.http.delete(this.baseUrl + 'members/delete-payment/' + id);
  }

  deleteMemberBeltExam(id: number) {
    return this.http.delete(this.baseUrl + 'members/delete-belt-exam/' + id);
  }
}
