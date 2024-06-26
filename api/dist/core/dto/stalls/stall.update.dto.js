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
exports.UpdateStallStatusDto = exports.UpdateStallDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const stall_base_dto_1 = require("./stall-base.dto");
class UpdateStallDto extends stall_base_dto_1.DefaultStallDto {
}
exports.UpdateStallDto = UpdateStallDto;
class UpdateStallStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        default: "",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["AVAILABLE", "INMAINTENANCE", "UNAVAILABLE"]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], UpdateStallStatusDto.prototype, "status", void 0);
exports.UpdateStallStatusDto = UpdateStallStatusDto;
//# sourceMappingURL=stall.update.dto.js.map