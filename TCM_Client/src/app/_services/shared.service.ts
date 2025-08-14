import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private router = inject(Router);
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getClubBelts(){
    return this.http.get(this.baseUrl+'common/belts')
  }

}
