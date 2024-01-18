import { Test, TestingModule } from '@nestjs/testing';
import { TenantRentContractService } from './tenant-rent-contract.service';

describe('TenantRentContractService', () => {
  let service: TenantRentContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantRentContractService],
    }).compile();

    service = module.get<TenantRentContractService>(TenantRentContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
