import { Test, TestingModule } from "@nestjs/testing";
import { TenantRentContractController } from "./tenant-rent-contract.controller";

describe("TenantRentContractController", () => {
  let controller: TenantRentContractController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantRentContractController],
    }).compile();

    controller = module.get<TenantRentContractController>(
      TenantRentContractController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
