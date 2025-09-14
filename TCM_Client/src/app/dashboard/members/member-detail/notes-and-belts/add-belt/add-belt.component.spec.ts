import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBeltComponent } from './add-belt.component';

describe('AddBeltComponent', () => {
  let component: AddBeltComponent;
  let fixture: ComponentFixture<AddBeltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBeltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBeltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
