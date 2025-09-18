import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancePerformanceComponent } from './attendance-performance.component';

describe('AttendancePerformanceComponent', () => {
  let component: AttendancePerformanceComponent;
  let fixture: ComponentFixture<AttendancePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendancePerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
