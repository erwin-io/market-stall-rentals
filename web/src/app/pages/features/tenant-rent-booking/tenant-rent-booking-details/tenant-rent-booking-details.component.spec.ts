import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRentBookingDetailsComponent } from './tenant-rent-booking-details.component';

describe('TenantRentBookingDetailsComponent', () => {
  let component: TenantRentBookingDetailsComponent;
  let fixture: ComponentFixture<TenantRentBookingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantRentBookingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantRentBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
