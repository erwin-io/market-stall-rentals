"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRentBookingModule = void 0;
const common_1 = require("@nestjs/common");
const tenant_rent_booking_controller_1 = require("./tenant-rent-booking.controller");
const TenantRentBooking_1 = require("../../db/entities/TenantRentBooking");
const tenant_rent_booking_service_1 = require("../../services/tenant-rent-booking.service");
const typeorm_1 = require("@nestjs/typeorm");
let TenantRentBookingModule = class TenantRentBookingModule {
};
TenantRentBookingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([TenantRentBooking_1.TenantRentBooking])],
        controllers: [tenant_rent_booking_controller_1.TenantRentBookingController],
        providers: [tenant_rent_booking_service_1.TenantRentBookingService],
        exports: [tenant_rent_booking_service_1.TenantRentBookingService],
    })
], TenantRentBookingModule);
exports.TenantRentBookingModule = TenantRentBookingModule;
//# sourceMappingURL=tenant-rent-booking.module.js.map