import { Test, TestingModule } from "@nestjs/testing";
import { ContractPaymentController } from "./contract-payment.controller";

describe("ContractPaymentController", () => {
  let controller: ContractPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractPaymentController],
    }).compile();

    controller = module.get<ContractPaymentController>(
      ContractPaymentController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
