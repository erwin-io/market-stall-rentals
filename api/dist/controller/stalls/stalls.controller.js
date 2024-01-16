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
exports.StallController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const stall_create_dto_1 = require("../../core/dto/stalls/stall.create.dto");
const stall_update_dto_1 = require("../../core/dto/stalls/stall.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const stalls_service_1 = require("../../services/stalls.service");
let StallController = class StallController {
    constructor(stallService) {
        this.stallService = stallService;
    }
    async getByCode(stallCode) {
        const res = {};
        try {
            res.data = await this.stallService.getByCode(stallCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getDetails(stallId) {
        const res = {};
        try {
            res.data = await this.stallService.getById(stallId);
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
            res.data = await this.stallService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(stallDto) {
        const res = {};
        try {
            res.data = await this.stallService.create(stallDto);
            res.success = true;
            res.message = `Stall ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(stallId, dto) {
        const res = {};
        try {
            res.data = await this.stallService.update(stallId, dto);
            res.success = true;
            res.message = `Stall ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(stallId) {
        const res = {};
        try {
            res.data = await this.stallService.delete(stallId);
            res.success = true;
            res.message = `Stall ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("getByCode/:stallCode"),
    __param(0, (0, common_1.Param)("stallCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StallController.prototype, "getByCode", null);
__decorate([
    (0, common_1.Get)("/:stallId"),
    __param(0, (0, common_1.Param)("stallId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StallController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], StallController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stall_create_dto_1.CreateStallDto]),
    __metadata("design:returntype", Promise)
], StallController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:stallId"),
    __param(0, (0, common_1.Param)("stallId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stall_update_dto_1.UpdateStallDto]),
    __metadata("design:returntype", Promise)
], StallController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:stallId"),
    __param(0, (0, common_1.Param)("stallId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StallController.prototype, "delete", null);
StallController = __decorate([
    (0, swagger_1.ApiTags)("stalls"),
    (0, common_1.Controller)("stalls"),
    __metadata("design:paramtypes", [stalls_service_1.StallsService])
], StallController);
exports.StallController = StallController;
//# sourceMappingURL=stalls.controller.js.map