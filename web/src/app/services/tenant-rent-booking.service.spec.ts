import { TestBed } from '@angular/core/testing';

import { TenantRentBookingService } from './tenant-rent-booking.service';

describe('TenantRentBookingService', () => {
  let service: TenantRentBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantRentBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
