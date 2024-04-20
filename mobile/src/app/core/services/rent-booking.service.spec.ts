import { TestBed } from '@angular/core/testing';

import { RentBookingService } from './rent-booking.service';

describe('RentBookingService', () => {
  let service: RentBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
