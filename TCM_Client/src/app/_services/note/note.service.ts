import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Note } from '../../_models/Note';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  constructor() {}

  getNotesForMember(
    dateCreated: string,
    fromMemberId: number,
    toMemberId: number,
    createdForTraining?: boolean
  ) {
    let params = new HttpParams();
    params = params.append('dateCreated', dateCreated);
    params = params.append('fromMemberId', fromMemberId);
    params = params.append('toMemberId', toMemberId);
    if (createdForTraining == true) {
      params = params.append('createdForTraining', createdForTraining);
    }

    return this.http.get<Note[]>(this.baseUrl + 'notes/notes', {
      params: params,
    });
  }
}
