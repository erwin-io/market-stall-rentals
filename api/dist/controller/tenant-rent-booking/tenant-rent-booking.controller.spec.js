"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tenant_rent_booking_controller_1 = require("./tenant-rent-booking.controller");
describe("TenantRentBookingController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [tenant_rent_booking_controller_1.TenantRentBookingController],
        }).compile();
        controller = module.get(tenant_rent_booking_controller_1.TenantRentBookingController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=tenant-rent-booking.controller.spec.js.map