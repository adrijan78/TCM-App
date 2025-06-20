import { TestBed } from '@angular/core/testing';

import { TrainingServiceService } from './training.service';

describe('TrainingServiceService', () => {
  let service: TrainingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
