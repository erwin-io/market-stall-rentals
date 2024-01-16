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
exports.StallClassificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stall_classifications_constant_1 = require("../common/constant/stall-classifications.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const utils_1 = require("../common/utils/utils");
const Files_1 = require("../db/entities/Files");
const StallClassifications_1 = require("../db/entities/StallClassifications");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const path_1 = require("path");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
let StallClassificationsService = class StallClassificationsService {
    constructor(firebaseProvoder, stallClassificationRepo) {
        this.firebaseProvoder = firebaseProvoder;
        this.stallClassificationRepo = stallClassificationRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.stallClassificationRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                relations: {
                    thumbnailFile: true,
                },
                skip,
                take,
                order,
            }),
            this.stallClassificationRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByCode(stallClassificationsCode) {
        const result = await this.stallClassificationRepo.findOne({
            where: {
                stallClassificationsCode,
                active: true,
            },
            relations: {
                thumbnailFile: true,
            },
        });
        if (!result) {
            throw Error(stall_classifications_constant_1.STALLCLASSIFICATION_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.stallClassificationRepo.manager.transaction(async (entityManager) => {
            let stallClassification = new StallClassifications_1.StallClassifications();
            stallClassification.name = dto.name;
            stallClassification.location = dto.location;
            stallClassification = await entityManager.save(stallClassification);
            stallClassification.stallClassificationsCode = (0, utils_1.generateIndentityCode)(stallClassification.stallClassificationId);
            if (dto.thumbnailFile) {
                const bucket = this.firebaseProvoder.app.storage().bucket();
                stallClassification.thumbnailFile = new Files_1.Files();
                const newFileName = (0, uuid_1.v4)();
                stallClassification.thumbnailFile.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                const bucketFile = bucket.file(`stall-classifications/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                const img = Buffer.from(dto.thumbnailFile.data, "base64");
                await bucketFile.save(img).then(async () => {
                    const url = await bucketFile.getSignedUrl({
                        action: "read",
                        expires: "03-09-2500",
                    });
                    stallClassification.thumbnailFile.url = url[0];
                    stallClassification.thumbnailFile = await entityManager.save(Files_1.Files, stallClassification.thumbnailFile);
                });
            }
            stallClassification = await entityManager.save(StallClassifications_1.StallClassifications, stallClassification);
            stallClassification = await entityManager.findOne(StallClassifications_1.StallClassifications, {
                where: {
                    stallClassificationId: stallClassification.stallClassificationId,
                },
                relations: {
                    thumbnailFile: true,
                },
            });
            return stallClassification;
        });
    }
    async update(stallClassificationsCode, dto) {
        return await this.stallClassificationRepo.manager.transaction(async (entityManager) => {
            let stallClassification = await entityManager.findOne(StallClassifications_1.StallClassifications, {
                where: {
                    stallClassificationsCode,
                    active: true,
                },
                relations: {
                    thumbnailFile: true,
                },
            });
            if (!stallClassification) {
                throw Error(stall_classifications_constant_1.STALLCLASSIFICATION_ERROR_NOT_FOUND);
            }
            stallClassification.name = dto.name;
            stallClassification.location = dto.location;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            stallClassification.dateAdded = timestamp;
            if (dto.thumbnailFile) {
                const newFileName = (0, uuid_1.v4)();
                const bucket = this.firebaseProvoder.app.storage().bucket();
                if (stallClassification.thumbnailFile) {
                    try {
                        const deleteFile = bucket.file(`stall-classifications/${stallClassification.thumbnailFile.fileName}`);
                        deleteFile.delete();
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                    const file = stallClassification.thumbnailFile;
                    file.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                    const bucketFile = bucket.file(`stall-classifications/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                    const img = Buffer.from(dto.thumbnailFile.data, "base64");
                    await bucketFile.save(img).then(async (res) => {
                        console.log("res");
                        console.log(res);
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        file.url = url[0];
                        stallClassification.thumbnailFile = await entityManager.save(Files_1.Files, file);
                    });
                }
                else {
                    stallClassification.thumbnailFile = new Files_1.Files();
                    stallClassification.thumbnailFile.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                    const bucketFile = bucket.file(`stall-classifications/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                    const img = Buffer.from(dto.thumbnailFile.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        stallClassification.thumbnailFile.url = url[0];
                        stallClassification.thumbnailFile = await entityManager.save(Files_1.Files, stallClassification.thumbnailFile);
                    });
                }
            }
            stallClassification = await entityManager.save(StallClassifications_1.StallClassifications, stallClassification);
            stallClassification = await entityManager.findOne(StallClassifications_1.StallClassifications, {
                where: {
                    stallClassificationId: stallClassification.stallClassificationId,
                },
                relations: {
                    thumbnailFile: true,
                },
            });
            return stallClassification;
        });
    }
    async delete(stallClassificationsCode) {
        return await this.stallClassificationRepo.manager.transaction(async (entityManager) => {
            const stallClassification = await entityManager.findOne(StallClassifications_1.StallClassifications, {
                where: {
                    stallClassificationsCode,
                    active: true,
                },
            });
            if (!stallClassification) {
                throw Error(stall_classifications_constant_1.STALLCLASSIFICATION_ERROR_NOT_FOUND);
            }
            stallClassification.active = false;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            stallClassification.dateLastUpdated = timestamp;
            return await entityManager.save(StallClassifications_1.StallClassifications, stallClassification);
        });
    }
};
StallClassificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(StallClassifications_1.StallClassifications)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], StallClassificationsService);
exports.StallClassificationsService = StallClassificationsService;
//# sourceMappingURL=stall-classifications.service.js.map