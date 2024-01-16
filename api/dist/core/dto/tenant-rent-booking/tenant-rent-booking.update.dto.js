"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTenantRentBookingStatusDto = exports.UpdateTenantRentBookingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const tenant_rent_booking_base_dto_1 = require("./tenant-rent-booking-base.dto");
class UpdateTenantRentBookingDto extends tenant_rent_booking_base_dto_1.DefaultTenantRentBookingDto {
}
exports.UpdateTenantRentBookingDto = UpdateTenantRentBookingDto;
class UpdateTenantRentBookingStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["REJECTED", "PROCESSING", "LEASED", "CANCELLED"]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], UpdateTenantRentBookingStatusDto.prototype, "status", void 0);
exports.UpdateTenantRentBookingStatusDto = UpdateTenantRentBookingStatusDto;
//# sourceMappingURL=tenant-rent-booking.update.dto.js.map