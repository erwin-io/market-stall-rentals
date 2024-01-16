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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRentBookingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const tenant_rent_booking_create_dto_1 = require("../../core/dto/tenant-rent-booking/tenant-rent-booking.create.dto");
const tenant_rent_booking_update_dto_1 = require("../../core/dto/tenant-rent-booking/tenant-rent-booking.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const tenant_rent_booking_service_1 = require("../../services/tenant-rent-booking.service");
let TenantRentBookingController = class TenantRentBookingController {
    constructor(tenantRentBookingService) {
        this.tenantRentBookingService = tenantRentBookingService;
    }
    async getDetails(tenantRentBookingCode) {
        const res = {};
        try {
            res.data = await this.tenantRentBookingService.getByCode(tenantRentBookingCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = await this.tenantRentBookingService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(tenantRentBookingDto) {
        const res = {};
        try {
            res.data = await this.tenantRentBookingService.create(tenantRentBookingDto);
            res.success = true;
            res.message = `TenantRentBooking ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(tenantRentBookingCode, dto) {
        const res = {};
        try {
            res.data = await this.tenantRentBookingService.update(tenantRentBookingCode, dto);
            res.success = true;
            res.message = `TenantRentBooking ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateStaus(tenantRentBookingCode, dto) {
        const res = {};
        try {
            res.data = await this.tenantRentBookingService.updateStaus(tenantRentBookingCode, dto);
            res.success = true;
            res.message = `TenantRentBooking ${api_response_constant_1.DELETE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
};
__decorate([
    (0, common_1.Get)("/:tenantRentBookingCode"),
    __param(0, (0, common_1.Param)("tenantRentBookingCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantRentBookingController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], TenantRentBookingController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_rent_booking_create_dto_1.CreateTenantRentBookingDto]),
    __metadata("design:returntype", Promise)
], TenantRentBookingController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:tenantRentBookingCode"),
    __param(0, (0, common_1.Param)("tenantRentBookingCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_rent_booking_update_dto_1.UpdateTenantRentBookingDto]),
    __metadata("design:returntype", Promise)
], TenantRentBookingController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("/:tenantRentBookingCode/updateStaus"),
    __param(0, (0, common_1.Param)("tenantRentBookingCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_rent_booking_update_dto_1.UpdateTenantRentBookingStatusDto]),
    __metadata("design:returntype", Promise)
], TenantRentBookingController.prototype, "updateStaus", null);
TenantRentBookingController = __decorate([
    (0, swagger_1.ApiTags)("tenant-rent-booking"),
    (0, common_1.Controller)("tenant-rent-booking"),
    __metadata("design:paramtypes", [tenant_rent_booking_service_1.TenantRentBookingService])
], TenantRentBookingController);
exports.TenantRentBookingController = TenantRentBookingController;
//# sourceMappingURL=tenant-rent-booking.controller.js.map