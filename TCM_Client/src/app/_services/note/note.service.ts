import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Note } from '../../_models/Note';
import { AddNote } from '../../_models/_enums/AddNote';

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
    trainingId: number | null
  ) {
    let params = new HttpParams();
    params = params.append('dateCreated', dateCreated);
    params = params.append('fromMemberId', fromMemberId);
    params = params.append('toMemberId', toMemberId);

    if (trainingId !== null) params = params.append('trainingId', trainingId);

    return this.http.get<Note[]>(this.baseUrl + 'notes/notes', {
      params: params,
    });
  }

  addNote(noteToSend: AddNote) {
    return this.http.post(this.baseUrl + 'notes/addNote', noteToSend);
  }

  deleteNote(noteId: number) {
    return this.http.delete(this.baseUrl + 'notes/deleteNote/' + noteId);
  }
}
