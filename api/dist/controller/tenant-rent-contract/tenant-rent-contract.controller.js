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
exports.TenantRentContractController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const tenant_rent_contract_create_dto_1 = require("../../core/dto/tenant-rent-contract/tenant-rent-contract.create.dto");
const tenant_rent_contract_update_dto_1 = require("../../core/dto/tenant-rent-contract/tenant-rent-contract.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const tenant_rent_contract_service_1 = require("../../services/tenant-rent-contract.service");
let TenantRentContractController = class TenantRentContractController {
    constructor(tenantRentContractService) {
        this.tenantRentContractService = tenantRentContractService;
    }
    async getDetails(tenantRentContractCode) {
        const res = {};
        try {
            res.data = await this.tenantRentContractService.getByCode(tenantRentContractCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getAllByTenantUserCode(tenantUserCode) {
        const res = {};
        try {
            res.data = await this.tenantRentContractService.getAllByTenantUserCode(tenantUserCode);
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
            res.data = await this.tenantRentContractService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(dto) {
        const res = {};
        try {
            res.data = await this.tenantRentContractService.create(dto);
            res.success = true;
            res.message = `Tenant Rent Contract ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async createFromBooking(dto) {
        const res = {};
        try {
            res.data = await this.tenantRentContractService.createFromBooking(dto);
            res.success = true;
            res.message = `Tenant Rent Contract ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateStatus(tenantRentContractCode, dto) {
        const res = {};
        try {
            res.data = await this.tenantRentContractService.updateStatus(tenantRentContractCode, dto);
            res.success = true;
            res.message = `Tenant Rent Contract status ${api_response_constant_1.UPDATE_SUCCESS}`;
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
    (0, common_1.Get)("/:tenantRentContractCode"),
    __param(0, (0, common_1.Param)("tenantRentContractCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantRentContractController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Get)("getAllByTenantUserCode/:tenantUserCode"),
    __param(0, (0, common_1.Param)("tenantUserCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantRentContractController.prototype, "getAllByTenantUserCode", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], TenantRentContractController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_rent_contract_create_dto_1.CreateTenantRentContractDto]),
    __metadata("design:returntype", Promise)
], TenantRentContractController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("/createFromBooking"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_rent_contract_create_dto_1.CreateTenantRentContracFromBookingtDto]),
    __metadata("design:returntype", Promise)
], TenantRentContractController.prototype, "createFromBooking", null);
__decorate([
    (0, common_1.Put)("/updateStatus/:tenantRentContractCode"),
    __param(0, (0, common_1.Param)("tenantRentContractCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_rent_contract_update_dto_1.UpdateTenantRentContractStatusDto]),
    __metadata("design:returntype", Promise)
], TenantRentContractController.prototype, "updateStatus", null);
TenantRentContractController = __decorate([
    (0, swagger_1.ApiTags)("tenant-rent-contract"),
    (0, common_1.Controller)("tenant-rent-contract"),
    __metadata("design:paramtypes", [tenant_rent_contract_service_1.TenantRentContractService])
], TenantRentContractController);
exports.TenantRentContractController = TenantRentContractController;
//# sourceMappingURL=tenant-rent-contract.controller.js.map