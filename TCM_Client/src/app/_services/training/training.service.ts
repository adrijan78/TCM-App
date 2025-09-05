import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Training, TrainingDetails } from '../../_models/Training';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  selectedTraining = signal<TrainingDetails | null>(null);

  getNumberOfTrainingsForEveryMonth(year: number) {
    var params = new HttpParams().set('year', year);

    return this.http.get(
      this.baseUrl + 'trainings/numberOfTrainingsPerMonth/' + 1,
      { params }
    );
  }

  setSelectedTraining(training: TrainingDetails) {
    this.selectedTraining.set(training);
  }

  getTrainingsByMoths(
    pageNumber?: number,
    pageSize?: number,
    selectedStatus?: number | null,
    selectedType?: number | null,
    searchTerm?: string
  ) {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    if (selectedStatus) {
      params = params.append('trainingStatus', selectedStatus);
    }
    if (selectedType) {
      params = params.append('trainingType', selectedType);
    }

    if (searchTerm && searchTerm != '') {
      params = params.append('searchTerm', searchTerm);
    }

    return this.http.get<Training>(this.baseUrl + 'trainings', {
      observe: 'response',
      params,
    });
  }

  getTraining(id: number) {
    return this.http.get<TrainingDetails>(
      this.baseUrl + 'trainings/training-details/' + id
    );
  }

  getTrainingTypes() {
    return this.http.get(this.baseUrl + 'trainings/training-types');
  }

  createTraining(training: any) {
    return this.http.post(this.baseUrl + 'trainings/create-training', training);
  }

  getTrainingsForMonth(month: number) {
    var params = new HttpParams().set('month', month);
    return this.http.get(this.baseUrl + `trainings/monthly-trainings`, {
      params,
    });
  }
}
