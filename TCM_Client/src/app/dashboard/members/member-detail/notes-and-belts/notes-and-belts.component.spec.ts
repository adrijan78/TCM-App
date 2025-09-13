import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesAndBeltsComponent } from './notes-and-belts.component';

describe('NotesAndBeltsComponent', () => {
  let component: NotesAndBeltsComponent;
  let fixture: ComponentFixture<NotesAndBeltsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesAndBeltsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesAndBeltsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
