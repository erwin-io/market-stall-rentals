import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRentBookingComponent } from './tenant-rent-booking.component';

describe('TenantRentBookingComponent', () => {
  let component: TenantRentBookingComponent;
  let fixture: ComponentFixture<TenantRentBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantRentBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantRentBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
