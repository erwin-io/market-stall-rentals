import { Test, TestingModule } from "@nestjs/testing";
import { StallClassificationsController } from "./stall-classifications.controller";

describe("StallClassificationsController", () => {
  let controller: StallClassificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StallClassificationsController],
    }).compile();

    controller = module.get<StallClassificationsController>(
      StallClassificationsController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
