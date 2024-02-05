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
exports.ContractPaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const contract_payment_service_1 = require("../../services/contract-payment.service");
const contract_payment_create_dto_1 = require("../../core/dto/contract-payment/contract-payment.create.dto");
let ContractPaymentController = class ContractPaymentController {
    constructor(contractPaymentService) {
        this.contractPaymentService = contractPaymentService;
    }
    async getByCode(contractPaymentCode) {
        const res = {};
        try {
            res.data = await this.contractPaymentService.getByCode(contractPaymentCode);
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
            res.data = await this.contractPaymentService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(contractPaymentDto) {
        const res = {};
        try {
            res.data = await this.contractPaymentService.create(contractPaymentDto);
            res.success = true;
            res.message = `Contract payment ${api_response_constant_1.SAVING_SUCCESS}`;
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
    (0, common_1.Get)("getByCode/:contractPaymentCode"),
    __param(0, (0, common_1.Param)("contractPaymentCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractPaymentController.prototype, "getByCode", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], ContractPaymentController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contract_payment_create_dto_1.CreateContractPaymentDto]),
    __metadata("design:returntype", Promise)
], ContractPaymentController.prototype, "create", null);
ContractPaymentController = __decorate([
    (0, swagger_1.ApiTags)("contract-payment"),
    (0, common_1.Controller)("contract-payment"),
    __metadata("design:paramtypes", [contract_payment_service_1.ContractPaymentService])
], ContractPaymentController);
exports.ContractPaymentController = ContractPaymentController;
//# sourceMappingURL=contract-payment.controller.js.map