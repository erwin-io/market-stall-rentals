import { TestBed } from '@angular/core/testing';

import { TenantRentContractService } from './tenant-rent-contract.service';

describe('TenantRentContractService', () => {
  let service: TenantRentContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantRentContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
