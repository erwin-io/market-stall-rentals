import { Test, TestingModule } from '@nestjs/testing';
import { TenantRentBookingService } from './tenant-rent-booking.service';

describe('TenantRentBookingService', () => {
  let service: TenantRentBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantRentBookingService],
    }).compile();

    service = module.get<TenantRentBookingService>(TenantRentBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
