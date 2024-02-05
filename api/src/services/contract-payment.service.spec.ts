import { Test, TestingModule } from '@nestjs/testing';
import { ContractPaymentService } from './contract-payment.service';

describe('ContractPaymentService', () => {
  let service: ContractPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractPaymentService],
    }).compile();

    service = module.get<ContractPaymentService>(ContractPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
