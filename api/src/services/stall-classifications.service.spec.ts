import { Test, TestingModule } from '@nestjs/testing';
import { StallClassificationsService } from './stall-classifications.service';

describe('StallClassificationsService', () => {
  let service: StallClassificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StallClassificationsService],
    }).compile();

    service = module.get<StallClassificationsService>(StallClassificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
