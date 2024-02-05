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
exports.ContractPaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payment_constant_1 = require("../common/constant/payment.constant");
const tenant_rent_contract_constant_1 = require("../common/constant/tenant-rent-contract.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const utils_1 = require("../common/utils/utils");
const ContractPayment_1 = require("../db/entities/ContractPayment");
const TenantRentContract_1 = require("../db/entities/TenantRentContract");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
const pusher_service_1 = require("./pusher.service");
let ContractPaymentService = class ContractPaymentService {
    constructor(contractPaymentRepo, pusherService) {
        this.contractPaymentRepo = contractPaymentRepo;
        this.pusherService = pusherService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.contractPaymentRepo.find({
                where: condition,
                skip,
                take,
                order,
                relations: {
                    user: {
                        access: true,
                        userProfilePic: {
                            file: true,
                        },
                    },
                    tenantRentContract: {
                        stall: {
                            stallClassification: {
                                thumbnailFile: true,
                            },
                        },
                        assignedCollectorUser: {
                            userProfilePic: {
                                file: true,
                            },
                        },
                        tenantUser: {
                            userProfilePic: {
                                file: true,
                            },
                        },
                    },
                },
            }),
            this.contractPaymentRepo.count({
                where: condition,
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByCode(contractPaymentCode) {
        const result = await this.contractPaymentRepo.findOne({
            where: {
                contractPaymentCode,
            },
            relations: {
                user: {
                    access: true,
                    userProfilePic: {
                        file: true,
                    },
                },
                tenantRentContract: {
                    stall: {
                        stallClassification: {
                            thumbnailFile: true,
                        },
                    },
                    assignedCollectorUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    tenantUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            },
        });
        if (!result) {
            throw Error(payment_constant_1.PAYMENT_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        try {
            return await this.contractPaymentRepo.manager.transaction(async (entityManager) => {
                let contractPayment = new ContractPayment_1.ContractPayment();
                contractPayment.datePaid = dto.datePaid;
                contractPayment.status = payment_constant_1.PAYMENT_STATUS.VALID;
                contractPayment.overDueAmount = dto.overDueAmount.toString();
                contractPayment.totalDueAmount = dto.totalDueAmount.toString();
                contractPayment.paymentAmount = dto.totalDueAmount.toString();
                const timestamp = await entityManager
                    .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                    .then((res) => {
                    return res[0]["timestamp"];
                });
                contractPayment.dateCreated = timestamp;
                const tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                    where: {
                        tenantRentContractCode: dto.tenantRentContractCode,
                    },
                });
                if (!tenantRentContract) {
                    throw Error(tenant_rent_contract_constant_1.TENANTRENTCONTRACT_ERROR_NOT_FOUND);
                }
                contractPayment.tenantRentContract = tenantRentContract;
                const user = await entityManager.findOne(Users_1.Users, {
                    where: {
                        userId: dto.paidByUserId,
                    },
                });
                if (!user) {
                    throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
                }
                contractPayment.user = user;
                contractPayment = await entityManager.save(ContractPayment_1.ContractPayment, contractPayment);
                return await entityManager.findOne(ContractPayment_1.ContractPayment, {
                    where: {
                        contractPaymentId: contractPayment.contractPaymentId,
                    },
                    relations: {
                        user: {
                            access: true,
                            userProfilePic: {
                                file: true,
                            },
                        },
                        tenantRentContract: {
                            stall: {
                                stallClassification: {
                                    thumbnailFile: true,
                                },
                            },
                            assignedCollectorUser: {
                                userProfilePic: {
                                    file: true,
                                },
                            },
                            tenantUser: {
                                userProfilePic: {
                                    file: true,
                                },
                            },
                        },
                    },
                });
            });
        }
        catch (ex) {
            throw ex;
        }
    }
};
ContractPaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ContractPayment_1.ContractPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService])
], ContractPaymentService);
exports.ContractPaymentService = ContractPaymentService;
//# sourceMappingURL=contract-payment.service.js.map