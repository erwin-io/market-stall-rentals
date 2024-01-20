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
exports.StallClassificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const stall_classifications_create_dto_1 = require("../../core/dto/stall-classifications/stall-classifications.create.dto");
const stall_classifications_update_dto_1 = require("../../core/dto/stall-classifications/stall-classifications.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const stall_classifications_service_1 = require("../../services/stall-classifications.service");
let StallClassificationsController = class StallClassificationsController {
    constructor(stallClassificationsService) {
        this.stallClassificationsService = stallClassificationsService;
    }
    async getAll() {
        const res = {};
        try {
            res.data = await this.stallClassificationsService.getAll();
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getDetails(stallClassificationsCode) {
        const res = {};
        try {
            res.data = await this.stallClassificationsService.getByCode(stallClassificationsCode);
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
            res.data = await this.stallClassificationsService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(stallClassificationsDto) {
        const res = {};
        try {
            res.data = await this.stallClassificationsService.create(stallClassificationsDto);
            res.success = true;
            res.message = `Stall Classifications ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(stallClassificationsCode, dto) {
        const res = {};
        try {
            res.data = await this.stallClassificationsService.update(stallClassificationsCode, dto);
            res.success = true;
            res.message = `Stall Classifications ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(stallClassificationsCode) {
        const res = {};
        try {
            res.data = await this.stallClassificationsService.delete(stallClassificationsCode);
            res.success = true;
            res.message = `Stall Classifications ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/getAll"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StallClassificationsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("/:stallClassificationsCode"),
    __param(0, (0, common_1.Param)("stallClassificationsCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StallClassificationsController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], StallClassificationsController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stall_classifications_create_dto_1.CreateStallClassificationDto]),
    __metadata("design:returntype", Promise)
], StallClassificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:stallClassificationsCode"),
    __param(0, (0, common_1.Param)("stallClassificationsCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stall_classifications_update_dto_1.UpdateStallClassificationDto]),
    __metadata("design:returntype", Promise)
], StallClassificationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:stallClassificationsCode"),
    __param(0, (0, common_1.Param)("stallClassificationsCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StallClassificationsController.prototype, "delete", null);
StallClassificationsController = __decorate([
    (0, swagger_1.ApiTags)("stall-classifications"),
    (0, common_1.Controller)("stall-classifications"),
    __metadata("design:paramtypes", [stall_classifications_service_1.StallClassificationsService])
], StallClassificationsController);
exports.StallClassificationsController = StallClassificationsController;
//# sourceMappingURL=stall-classifications.controller.js.map