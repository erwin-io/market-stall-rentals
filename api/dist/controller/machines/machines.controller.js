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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachinesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const machines_create_dto_1 = require("src/core/dto/machines/machines.create.dto");
const machines_update_dto_1 = require("src/core/dto/machines/machines.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const machines_service_1 = require("src/services/machines.service");
let MachinesController = class MachinesController {
    constructor(machinesService) {
        this.machinesService = machinesService;
    }
    async getDetails(machineCode) {
        const res = {};
        try {
            res.data = await this.machinesService.getByCode(machineCode);
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
            res.data = await this.machinesService.getMachinesPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(machinesDto) {
        const res = {};
        try {
            res.data = await this.machinesService.create(machinesDto);
            res.success = true;
            res.message = `Machines ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async batchCreate(machinesDto) {
        const res = {};
        try {
            res.data = await this.machinesService.batchCreate(machinesDto);
            res.success = true;
            res.message = `Machines ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(machineCode, dto) {
        const res = {};
        try {
            res.data = await this.machinesService.update(machineCode, dto);
            res.success = true;
            res.message = `Machines ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(machineCode) {
        const res = {};
        try {
            res.data = await this.machinesService.delete(machineCode);
            res.success = true;
            res.message = `Machines ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:machineCode"),
    __param(0, (0, common_1.Param)("machineCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MachinesController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], MachinesController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof machines_create_dto_1.CreateMachineDto !== "undefined" && machines_create_dto_1.CreateMachineDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], MachinesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBody)({
        isArray: true,
        type: machines_create_dto_1.CreateMachineDto,
    }),
    (0, common_1.Post)("batchCreate"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], MachinesController.prototype, "batchCreate", null);
__decorate([
    (0, common_1.Put)("/:machineCode"),
    __param(0, (0, common_1.Param)("machineCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof machines_update_dto_1.UpdateMachineDto !== "undefined" && machines_update_dto_1.UpdateMachineDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], MachinesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:machineCode"),
    __param(0, (0, common_1.Param)("machineCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MachinesController.prototype, "delete", null);
MachinesController = __decorate([
    (0, swagger_1.ApiTags)("machines"),
    (0, common_1.Controller)("machines"),
    __metadata("design:paramtypes", [typeof (_a = typeof machines_service_1.MachinesService !== "undefined" && machines_service_1.MachinesService) === "function" ? _a : Object])
], MachinesController);
exports.MachinesController = MachinesController;
//# sourceMappingURL=machines.controller.js.map