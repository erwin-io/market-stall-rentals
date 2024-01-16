import { TestBed } from '@angular/core/testing';

import { StallClassificationService } from './stall-classifications.service';

describe('StallClassificationService', () => {
  let service: StallClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StallClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
