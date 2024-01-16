import { Test, TestingModule } from "@nestjs/testing";
import { TenantRentBookingController } from "./tenant-rent-booking.controller";

describe("TenantRentBookingController", () => {
  let controller: TenantRentBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantRentBookingController],
    }).compile();

    controller = module.get<TenantRentBookingController>(TenantRentBookingController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
