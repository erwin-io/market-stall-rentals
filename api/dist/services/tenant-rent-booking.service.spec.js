"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tenant_rent_booking_service_1 = require("./tenant-rent-booking.service");
describe('TenantRentBookingService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [tenant_rent_booking_service_1.TenantRentBookingService],
        }).compile();
        service = module.get(tenant_rent_booking_service_1.TenantRentBookingService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=tenant-rent-booking.service.spec.js.map