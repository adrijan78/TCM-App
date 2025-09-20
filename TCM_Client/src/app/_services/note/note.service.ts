import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Note } from '../../_models/Note';
import { AddNote } from '../../_models/_enums/AddNote';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  constructor() {}

  getNotesForMember(
    fromMemberId: number,
    toMemberId: number | null,
    trainingId: number | null
  ) {
    let params = new HttpParams();
    params = params.append('fromMemberId', fromMemberId);

    if (toMemberId !== null) params = params.append('toMemberId', toMemberId);

    if (trainingId !== null) params = params.append('trainingId', trainingId);

    return this.http.get<Note[]>(this.baseUrl + 'notes/notes', {
      params: params,
    });
  }

  getClubNotes(
    fromMemberId: number = 0,
    pageNumber?: number,
    pageSize?: number,
    selectedPriority?: number | null,
    searchTerm?: string,
    toMemberId?: number | null
  ) {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    if (selectedPriority) {
      params = params.append('priority', selectedPriority);
    }
    if (searchTerm) {
      params = params.append('searchTerm', searchTerm);
    }
    if (toMemberId) {
      params = params.append('toMemberId', toMemberId);
    }

    return this.http.get<Note[]>(this.baseUrl + 'notes/club-notes', {
      observe: 'response',
      params,
    });
  }

  addNote(noteToSend: AddNote) {
    return this.http.post(this.baseUrl + 'notes/addNote', noteToSend);
  }

  deleteNote(noteId: number) {
    return this.http.delete(this.baseUrl + 'notes/deleteNote/' + noteId);
  }
}
