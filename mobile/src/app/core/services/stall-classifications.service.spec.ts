import { TestBed } from '@angular/core/testing';

import { StallClassificationsService } from './stall-classifications.service';

describe('StallClassificationsService', () => {
  let service: StallClassificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StallClassificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
