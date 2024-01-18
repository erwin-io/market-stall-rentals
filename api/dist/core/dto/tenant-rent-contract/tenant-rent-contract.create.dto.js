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
exports.CreateTenantRentContracFromBookingtDto = exports.CreateTenantRentContractDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const tenant_rent_contract_base_dto_1 = require("./tenant-rent-contract-base.dto");
class CreateTenantRentContractDto extends tenant_rent_contract_base_dto_1.DefaultTenantRentContractDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Stall is required!"
    }),
    __metadata("design:type", String)
], CreateTenantRentContractDto.prototype, "stallCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["DAILY", "WEEKLY", "MONTHLY"]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], CreateTenantRentContractDto.prototype, "stallRateCode", void 0);
exports.CreateTenantRentContractDto = CreateTenantRentContractDto;
class CreateTenantRentContracFromBookingtDto extends tenant_rent_contract_base_dto_1.DefaultTenantRentContractDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTenantRentContracFromBookingtDto.prototype, "tenantRentBookingCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["DAILY", "WEEKLY", "MONTHLY"]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], CreateTenantRentContracFromBookingtDto.prototype, "stallRateCode", void 0);
exports.CreateTenantRentContracFromBookingtDto = CreateTenantRentContracFromBookingtDto;
//# sourceMappingURL=tenant-rent-contract.create.dto.js.map