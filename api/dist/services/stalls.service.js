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
exports.StallsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stall_classifications_constant_1 = require("../common/constant/stall-classifications.constant");
const stalls_constant_1 = require("../common/constant/stalls.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const utils_1 = require("../common/utils/utils");
const StallClassifications_1 = require("../db/entities/StallClassifications");
const Stalls_1 = require("../db/entities/Stalls");
const typeorm_2 = require("typeorm");
let StallsService = class StallsService {
    constructor(stallRepo) {
        this.stallRepo = stallRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.stallRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
                relations: {
                    stallClassification: {
                        thumbnailFile: true,
                    },
                },
            }),
            this.stallRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getById(stallId) {
        const result = await this.stallRepo.findOne({
            where: {
                stallId,
                active: true,
            },
            relations: {
                stallClassification: {
                    thumbnailFile: true,
                },
            },
        });
        if (!result) {
            throw Error(stalls_constant_1.STALL_ERROR_NOT_FOUND);
        }
        return result;
    }
    async getByCode(stallCode = "") {
        var _a;
        const result = await this.stallRepo.findOne({
            where: {
                stallCode: (_a = stallCode === null || stallCode === void 0 ? void 0 : stallCode.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                active: true,
            },
            relations: {
                stallClassification: {
                    thumbnailFile: true,
                },
            },
        });
        if (!result) {
            throw Error(stalls_constant_1.STALL_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        try {
            return await this.stallRepo.manager.transaction(async (entityManager) => {
                let stall = new Stalls_1.Stalls();
                stall.stallCode = dto.stallCode.toLowerCase();
                stall.name = dto.name;
                stall.areaName = dto.areaName;
                stall.status = stalls_constant_1.STALL_STATUS.AVAILABLE;
                stall.stallRentAmount = dto.stallRentAmount
                    ? dto.stallRentAmount.toString()
                    : "0";
                const timestamp = await entityManager
                    .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                    .then((res) => {
                    return res[0]["timestamp"];
                });
                stall.dateAdded = timestamp;
                const stallClassification = await entityManager.findOne(StallClassifications_1.StallClassifications, {
                    where: {
                        stallClassificationId: dto.stallClassificationId,
                    },
                });
                if (!stallClassification) {
                    throw Error(stall_classifications_constant_1.STALLCLASSIFICATION_ERROR_NOT_FOUND);
                }
                stall.stallClassification = stallClassification;
                stall = await entityManager.save(stall);
                return await entityManager.findOne(Stalls_1.Stalls, {
                    where: {
                        stallId: stall.stallId,
                    },
                    relations: {
                        stallClassification: {
                            thumbnailFile: true,
                        },
                    },
                });
            });
        }
        catch (ex) {
            if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_stall")) {
                throw Error("Stall name already exist!");
            }
            else if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_stallcode")) {
                throw Error("Stall code already exist!");
            }
            else {
                throw ex;
            }
        }
    }
    async update(stallId, dto) {
        try {
            return await this.stallRepo.manager.transaction(async (entityManager) => {
                let stall = await entityManager.findOne(Stalls_1.Stalls, {
                    where: {
                        stallId,
                        active: true,
                    },
                    relations: {
                        stallClassification: true,
                    },
                });
                if (!stall) {
                    throw Error(stalls_constant_1.STALL_ERROR_NOT_FOUND);
                }
                stall.stallCode = dto.stallCode.toLowerCase();
                stall.name = dto.name;
                stall.areaName = dto.areaName;
                stall.stallRentAmount = dto.stallRentAmount
                    ? dto.stallRentAmount.toString()
                    : "0";
                const timestamp = await entityManager
                    .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                    .then((res) => {
                    return res[0]["timestamp"];
                });
                stall.dateLastUpdated = timestamp;
                const stallClassification = await entityManager.findOne(StallClassifications_1.StallClassifications, {
                    where: {
                        stallClassificationId: dto.stallClassificationId,
                    },
                });
                if (!stallClassification) {
                    throw Error(stall_classifications_constant_1.STALLCLASSIFICATION_ERROR_NOT_FOUND);
                }
                stall.stallClassification = stallClassification;
                stall = await entityManager.save(Stalls_1.Stalls, stall);
                return await entityManager.findOne(Stalls_1.Stalls, {
                    where: {
                        stallId,
                        active: true,
                    },
                    relations: {
                        stallClassification: {
                            thumbnailFile: true,
                        },
                    },
                });
            });
        }
        catch (ex) {
            if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_stall")) {
                throw Error("Stall name already exist!");
            }
            else if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_stallcode")) {
                throw Error("Stall code already exist!");
            }
            else {
                throw ex;
            }
        }
    }
    async updateStatus(stallId, dto) {
        return await this.stallRepo.manager.transaction(async (entityManager) => {
            let stall = await entityManager.findOne(Stalls_1.Stalls, {
                where: {
                    stallId,
                    active: true,
                },
                relations: {
                    stallClassification: true,
                },
            });
            if (!stall) {
                throw Error(stalls_constant_1.STALL_ERROR_NOT_FOUND);
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            stall.dateLastUpdated = timestamp;
            stall.status = dto.status;
            stall = await entityManager.save(Stalls_1.Stalls, stall);
            return await entityManager.findOne(Stalls_1.Stalls, {
                where: {
                    stallId,
                    active: true,
                },
                relations: {
                    stallClassification: {
                        thumbnailFile: true,
                    },
                },
            });
        });
    }
    async delete(stallId) {
        return await this.stallRepo.manager.transaction(async (entityManager) => {
            const stall = await entityManager.findOne(Stalls_1.Stalls, {
                where: {
                    stallId,
                    active: true,
                },
                relations: {
                    stallClassification: true,
                },
            });
            if (!stall) {
                throw Error(stalls_constant_1.STALL_ERROR_NOT_FOUND);
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            stall.dateLastUpdated = timestamp;
            stall.active = false;
            return await entityManager.save(Stalls_1.Stalls, stall);
        });
    }
};
StallsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Stalls_1.Stalls)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StallsService);
exports.StallsService = StallsService;
//# sourceMappingURL=stalls.service.js.map