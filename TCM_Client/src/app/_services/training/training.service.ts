import { HttpClient } from '@angular/common/http';
import {  inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private http=inject(HttpClient);
  baseUrl = environment.apiUrl;
  
  getNumberOfTrainingsForEveryMonth(){
    return this.http.get(this.baseUrl+'trainings/numberOfTrainingsPerMonth/'+1);
  }
  
}
