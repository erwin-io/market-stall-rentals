import { TestBed } from '@angular/core/testing';

import { StallsService } from './stalls.service';

describe('StallsService', () => {
  let service: StallsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StallsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
