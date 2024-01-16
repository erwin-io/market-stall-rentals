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
exports.CloseInventoryRequestStatusDto = exports.ProcessInventoryRequestStatusDto = exports.UpdateInventoryRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const inventory_request_base_dto_1 = require("./inventory-request-base.dto");
class UpdateInventoryRequestDto extends inventory_request_base_dto_1.DefaultInventoryRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateInventoryRequestDto.prototype, "updatedByUserId", void 0);
exports.UpdateInventoryRequestDto = UpdateInventoryRequestDto;
class ProcessInventoryRequestStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        default: "",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)([
        "PENDING",
        "REJECTED",
        "PROCESSING",
        "IN-TRANSIT",
        "COMPLETED",
        "CANCELLED",
        "PARTIALLY-FULFILLED",
    ]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], ProcessInventoryRequestStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessInventoryRequestStatusDto.prototype, "updatedByUserId", void 0);
exports.ProcessInventoryRequestStatusDto = ProcessInventoryRequestStatusDto;
class CloseInventoryRequestStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        default: "",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)([
        "PENDING",
        "REJECTED",
        "PROCESSING",
        "IN-TRANSIT",
        "COMPLETED",
        "CANCELLED",
        "PARTIALLY-FULFILLED",
    ]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], CloseInventoryRequestStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        default: "Notes",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CloseInventoryRequestStatusDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CloseInventoryRequestStatusDto.prototype, "updatedByUserId", void 0);
exports.CloseInventoryRequestStatusDto = CloseInventoryRequestStatusDto;
//# sourceMappingURL=inventory-request.update.dto.js.map