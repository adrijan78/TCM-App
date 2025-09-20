import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfullPaymentComponent } from './successfull-payment.component';

describe('SuccessfullPaymentComponent', () => {
  let component: SuccessfullPaymentComponent;
  let fixture: ComponentFixture<SuccessfullPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessfullPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessfullPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
