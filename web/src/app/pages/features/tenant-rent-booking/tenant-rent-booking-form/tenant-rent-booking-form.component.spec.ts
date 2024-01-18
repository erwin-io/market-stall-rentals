import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRentBookingFormComponent } from './tenant-rent-booking-form.component';

describe('TenantRentBookingFormComponent', () => {
  let component: TenantRentBookingFormComponent;
  let fixture: ComponentFixture<TenantRentBookingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantRentBookingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantRentBookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
