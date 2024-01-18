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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRentContractService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment_1 = __importDefault(require("moment"));
const date_constant_1 = require("../common/constant/date.constant");
const stalls_constant_1 = require("../common/constant/stalls.constant");
const tenant_rent_booking_constant_1 = require("../common/constant/tenant-rent-booking.constant");
const tenant_rent_contract_constant_1 = require("../common/constant/tenant-rent-contract.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const user_type_constant_1 = require("../common/constant/user-type.constant");
const utils_1 = require("../common/utils/utils");
const Stalls_1 = require("../db/entities/Stalls");
const TenantRentBooking_1 = require("../db/entities/TenantRentBooking");
const TenantRentContract_1 = require("../db/entities/TenantRentContract");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
let TenantRentContractService = class TenantRentContractService {
    constructor(tenantRentContractRepo) {
        this.tenantRentContractRepo = tenantRentContractRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.tenantRentContractRepo.find({
                where: Object.assign({}, condition),
                relations: {
                    stall: {
                        stallClassification: {
                            thumbnailFile: true,
                        },
                    },
                    tenantUser: {
                        userProfilePic: true,
                    },
                },
                skip,
                take,
                order,
            }),
            this.tenantRentContractRepo.count({
                where: Object.assign({}, condition),
            }),
        ]);
        return {
            results: results.map((x) => {
                delete x.tenantUser.password;
                return x;
            }),
            total,
        };
    }
    async getByCode(tenantRentContractCode) {
        const result = await this.tenantRentContractRepo.findOne({
            where: {
                tenantRentContractCode,
            },
            relations: {
                stall: {
                    stallClassification: {
                        thumbnailFile: true,
                    },
                },
                tenantUser: {
                    userProfilePic: {
                        file: true,
                    },
                },
            },
        });
        if (!result) {
            throw Error(tenant_rent_contract_constant_1.TENANTRENTCONTRACT_ERROR_NOT_FOUND);
        }
        delete result.tenantUser.password;
        return result;
    }
    async create(dto) {
        return await this.tenantRentContractRepo.manager.transaction(async (entityManager) => {
            let stall = await entityManager.findOne(Stalls_1.Stalls, {
                where: {
                    stallCode: dto.stallCode,
                    status: stalls_constant_1.STALL_STATUS.AVAILABLE,
                },
            });
            if (!stall) {
                throw Error(stalls_constant_1.STALL_ERROR_NOT_AVAILABLE);
            }
            let tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                where: {
                    tenantUser: {
                        userCode: dto.tenantUserCode,
                    },
                    stall: {
                        stallCode: stall.stallCode,
                    },
                    status: tenant_rent_contract_constant_1.TENANTRENTCONTRACT_STATUS.ACTIVE,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    tenantUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            if (tenantRentContract) {
                throw Error("Stall was already rented by tenant");
            }
            tenantRentContract = new TenantRentContract_1.TenantRentContract();
            tenantRentContract.stall = stall;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            tenantRentContract.dateCreated = timestamp;
            const dateStart = (0, moment_1.default)(new Date(dto.dateStart), date_constant_1.DateConstant.DATE_LANGUAGE).format("YYYY-MM-DD");
            tenantRentContract.dateStart = dateStart;
            tenantRentContract.stallRateCode = dto.stallRateCode;
            let stallRentAmount = 0;
            if (dto.stallRateCode === "DAILY") {
                stallRentAmount =
                    stall.dailyRate && !isNaN(Number(stall.dailyRate))
                        ? Number(stall.dailyRate)
                        : 0;
            }
            else if (dto.stallRateCode === "WEEKLY") {
                stallRentAmount =
                    stall.weeklyRate && !isNaN(Number(stall.weeklyRate))
                        ? Number(stall.weeklyRate)
                        : 0;
            }
            else {
                stallRentAmount =
                    stall.monthlyRate && !isNaN(Number(stall.monthlyRate))
                        ? Number(stall.monthlyRate)
                        : 0;
            }
            tenantRentContract.stallRentAmount = Number(stallRentAmount).toFixed(2);
            tenantRentContract.otherCharges = Number(dto.otherCharges).toFixed(2);
            const totalRentAmount = Number(stallRentAmount) + Number(dto.otherCharges);
            tenantRentContract.totalRentAmount = totalRentAmount.toFixed(2);
            tenantRentContract.status = tenant_rent_contract_constant_1.TENANTRENTCONTRACT_STATUS.ACTIVE;
            const tenantUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode: dto.tenantUserCode,
                    userType: user_type_constant_1.USER_TYPE.TENANT,
                },
            });
            if (!tenantUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            tenantRentContract.tenantUser = tenantUser;
            tenantRentContract = await entityManager.save(tenantRentContract);
            tenantRentContract.tenantRentContractCode = (0, utils_1.generateIndentityCode)(tenantRentContract.tenantRentContractId);
            tenantRentContract = await entityManager.save(TenantRentContract_1.TenantRentContract, tenantRentContract);
            stall.status = stalls_constant_1.STALL_STATUS.OCCUPIED;
            stall = await entityManager.save(Stalls_1.Stalls, stall);
            tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                where: {
                    tenantRentContractCode: tenantRentContract.tenantRentContractCode,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    tenantUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            delete tenantRentContract.tenantUser.password;
            return tenantRentContract;
        });
    }
    async createFromBooking(dto) {
        return await this.tenantRentContractRepo.manager.transaction(async (entityManager) => {
            let tenantRentBooking = await entityManager.findOne(TenantRentBooking_1.TenantRentBooking, {
                where: {
                    tenantRentBookingCode: dto.tenantRentBookingCode,
                    requestedByUser: {
                        userCode: dto.tenantUserCode,
                    },
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    requestedByUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            if (!tenantRentBooking) {
                throw Error(tenant_rent_booking_constant_1.TENANTRENTBOOKING_ERROR_NOT_FOUND);
            }
            if (tenantRentBooking &&
                tenantRentBooking.status !== tenant_rent_booking_constant_1.TENANTRENTBOOKING_STATUS.PENDING) {
                throw Error(`Booking was already ${tenantRentBooking.status.toLowerCase()}!`);
            }
            let tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                where: {
                    tenantUser: {
                        userCode: dto.tenantUserCode,
                    },
                    stall: {
                        stallCode: tenantRentBooking.stall.stallCode,
                    },
                    status: tenant_rent_contract_constant_1.TENANTRENTCONTRACT_STATUS.ACTIVE,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    tenantUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            if (tenantRentContract) {
                throw Error("Stall was already rented by tenant");
            }
            tenantRentContract = new TenantRentContract_1.TenantRentContract();
            let stall = await entityManager.findOne(Stalls_1.Stalls, {
                where: {
                    stallCode: tenantRentBooking.stall.stallCode,
                    status: stalls_constant_1.STALL_STATUS.AVAILABLE,
                },
            });
            if (!stall) {
                throw Error(stalls_constant_1.STALL_ERROR_NOT_AVAILABLE);
            }
            tenantRentContract.stall = stall;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            tenantRentContract.dateCreated = timestamp;
            const dateStart = (0, moment_1.default)(new Date(dto.dateStart), date_constant_1.DateConstant.DATE_LANGUAGE).format("YYYY-MM-DD");
            tenantRentContract.dateStart = dateStart;
            tenantRentContract.stallRateCode = dto.stallRateCode;
            let stallRentAmount = 0;
            if (dto.stallRateCode === "DAILY") {
                stallRentAmount =
                    stall.dailyRate && !isNaN(Number(stall.dailyRate))
                        ? Number(stall.dailyRate)
                        : 0;
            }
            else if (dto.stallRateCode === "WEEKLY") {
                stallRentAmount =
                    stall.weeklyRate && !isNaN(Number(stall.weeklyRate))
                        ? Number(stall.weeklyRate)
                        : 0;
            }
            else {
                stallRentAmount =
                    stall.monthlyRate && !isNaN(Number(stall.monthlyRate))
                        ? Number(stall.monthlyRate)
                        : 0;
            }
            tenantRentContract.stallRentAmount = Number(stallRentAmount).toFixed(2);
            tenantRentContract.otherCharges = Number(dto.otherCharges).toFixed(2);
            const totalRentAmount = Number(stallRentAmount) + Number(dto.otherCharges);
            tenantRentContract.totalRentAmount = totalRentAmount.toFixed(2);
            tenantRentContract.status = tenant_rent_contract_constant_1.TENANTRENTCONTRACT_STATUS.ACTIVE;
            const tenantUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode: dto.tenantUserCode,
                    userType: user_type_constant_1.USER_TYPE.TENANT,
                },
            });
            if (!tenantUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            tenantRentContract.tenantUser = tenantUser;
            tenantRentContract = await entityManager.save(tenantRentContract);
            tenantRentContract.tenantRentContractCode = (0, utils_1.generateIndentityCode)(tenantRentContract.tenantRentContractId);
            tenantRentContract = await entityManager.save(TenantRentContract_1.TenantRentContract, tenantRentContract);
            stall.status = stalls_constant_1.STALL_STATUS.OCCUPIED;
            stall = await entityManager.save(Stalls_1.Stalls, stall);
            tenantRentBooking.status = tenant_rent_booking_constant_1.TENANTRENTBOOKING_STATUS.LEASED;
            tenantRentBooking = await entityManager.save(TenantRentBooking_1.TenantRentBooking, tenantRentBooking);
            tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                where: {
                    tenantRentContractCode: tenantRentContract.tenantRentContractCode,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    tenantUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            delete tenantRentContract.tenantUser.password;
            return tenantRentContract;
        });
    }
    async updateStatus(tenantRentContractCode, dto) {
        return await this.tenantRentContractRepo.manager.transaction(async (entityManager) => {
            let tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                where: {
                    tenantRentContractCode,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    tenantUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            if (!tenantRentContract) {
                throw Error(tenant_rent_contract_constant_1.TENANTRENTCONTRACT_ERROR_NOT_FOUND);
            }
            if (tenantRentContract.status !== tenant_rent_contract_constant_1.TENANTRENTCONTRACT_STATUS.ACTIVE) {
                throw Error("The contract was already in the state of: " +
                    tenantRentContract.status.toLocaleLowerCase());
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            tenantRentContract.dateLastUpdated = timestamp;
            tenantRentContract.status = dto.status;
            tenantRentContract = await entityManager.save(TenantRentContract_1.TenantRentContract, tenantRentContract);
            let stall = await entityManager.findOne(Stalls_1.Stalls, {
                where: {
                    stallCode: tenantRentContract.stall.stallCode,
                },
            });
            if (!stall) {
                throw Error(stalls_constant_1.STALL_ERROR_NOT_AVAILABLE);
            }
            stall.status = stalls_constant_1.STALL_STATUS.AVAILABLE;
            stall = await entityManager.save(Stalls_1.Stalls, stall);
            tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                where: {
                    tenantRentContractCode,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    tenantUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            delete tenantRentContract.tenantUser.password;
            return tenantRentContract;
        });
    }
};
TenantRentContractService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(TenantRentContract_1.TenantRentContract)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TenantRentContractService);
exports.TenantRentContractService = TenantRentContractService;
//# sourceMappingURL=tenant-rent-contract.service.js.map