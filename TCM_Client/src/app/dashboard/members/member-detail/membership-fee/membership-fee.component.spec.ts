import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipFeeComponent } from './membership-fee.component';

describe('MembershipFeeComponent', () => {
  let component: MembershipFeeComponent;
  let fixture: ComponentFixture<MembershipFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
