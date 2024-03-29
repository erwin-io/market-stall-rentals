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
const date_constant_1 = require("../common/constant/date.constant");
const moment_1 = __importDefault(require("moment"));
const user_type_constant_1 = require("../common/constant/user-type.constant");
const notifications_constant_1 = require("../common/constant/notifications.constant");
const Notifications_1 = require("../db/entities/Notifications");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
let ContractPaymentService = class ContractPaymentService {
    constructor(contractPaymentRepo, pusherService, oneSignalNotificationService) {
        this.contractPaymentRepo = contractPaymentRepo;
        this.pusherService = pusherService;
        this.oneSignalNotificationService = oneSignalNotificationService;
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
                contractPayment.referenceNumber = dto.referenceNumber;
                const datePaid = (0, moment_1.default)(new Date(dto.datePaid), date_constant_1.DateConstant.DATE_LANGUAGE).format();
                contractPayment.datePaid = datePaid;
                const dueDateStart = (0, moment_1.default)(new Date(dto.dueDateStart), date_constant_1.DateConstant.DATE_LANGUAGE).format();
                contractPayment.dueDateStart = dueDateStart;
                const dueDateEnd = (0, moment_1.default)(new Date(dto.dueDateEnd), date_constant_1.DateConstant.DATE_LANGUAGE).format();
                contractPayment.dueDateEnd = dueDateEnd;
                contractPayment.status = payment_constant_1.PAYMENT_STATUS.VALID;
                contractPayment.dueAmount = dto.dueAmount.toString();
                contractPayment.overDueAmount = dto.overDueAmount.toString();
                contractPayment.totalDueAmount = dto.totalDueAmount.toString();
                contractPayment.paymentAmount = dto.totalDueAmount.toString();
                const timestamp = await entityManager
                    .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                    .then((res) => {
                    return res[0]["timestamp"];
                });
                contractPayment.dateCreated = timestamp;
                let tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                    where: {
                        tenantRentContractCode: dto.tenantRentContractCode,
                    },
                });
                if (!tenantRentContract) {
                    throw Error(tenant_rent_contract_constant_1.TENANTRENTCONTRACT_ERROR_NOT_FOUND);
                }
                const currenDueDate = (0, moment_1.default)(new Date(dto.dueDateEnd), date_constant_1.DateConstant.DATE_LANGUAGE).format("YYYY-MM-DD");
                let nextCurrentDueDate;
                if (tenantRentContract.stallRateCode.toString().toUpperCase() ===
                    "MONTHLY") {
                    const getDateQuery = (0, timestamp_constant_1.getNextMonth)(currenDueDate);
                    nextCurrentDueDate = await entityManager
                        .query(getDateQuery)
                        .then((res) => {
                        return res[0]["nextmonth"];
                    });
                }
                else if (tenantRentContract.stallRateCode.toString().toUpperCase() ===
                    "WEEKLY") {
                    const getDateQuery = (0, timestamp_constant_1.getNextWeek)(currenDueDate);
                    nextCurrentDueDate = await entityManager
                        .query(getDateQuery)
                        .then((res) => {
                        return res[0]["nextweek"];
                    });
                }
                else {
                    const getDateQuery = (0, timestamp_constant_1.getNextDate)(currenDueDate, 1);
                    nextCurrentDueDate = await entityManager
                        .query(getDateQuery)
                        .then((res) => {
                        return res[0]["nextdate"];
                    });
                }
                tenantRentContract.currentDueDate = nextCurrentDueDate;
                tenantRentContract = await entityManager.save(TenantRentContract_1.TenantRentContract, tenantRentContract);
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
                contractPayment.contractPaymentCode = (0, utils_1.generateIndentityCode)(contractPayment.contractPaymentId);
                contractPayment = await entityManager.save(ContractPayment_1.ContractPayment, contractPayment);
                const title = `Bill Payment received!`;
                const desc = `You've made a payment of PHP ${contractPayment.paymentAmount} to your Stall rent contract #${tenantRentContract.tenantRentContractCode} on ${(0, moment_1.default)(contractPayment.datePaid).format("MMM DD, YYYY")} `;
                const staffUsers = await entityManager.find(Users_1.Users, {
                    where: { userType: user_type_constant_1.USER_TYPE.STAFF },
                });
                tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                    where: {
                        tenantRentContractId: tenantRentContract.tenantRentContractId,
                    },
                    relations: {
                        tenantUser: true,
                    },
                });
                contractPayment.tenantRentContract = tenantRentContract;
                const notificationIds = await this.logNotification([tenantRentContract.tenantUser], contractPayment, entityManager, title, desc);
                await this.syncRealTime([
                    ...staffUsers.map((x) => x.userId),
                    tenantRentContract.tenantUser.userId,
                ], contractPayment);
                const pushNotifResults = await this.oneSignalNotificationService.sendToExternalUser(tenantRentContract.tenantUser.userName, "TENANT_RENT_CONTRACT_PAYMENT", contractPayment.contractPaymentCode, notificationIds, title, desc);
                console.log("Push notif results ", JSON.stringify(pushNotifResults));
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
    async logNotification(users, data, entityManager, title, description) {
        const notifications = [];
        for (const user of users) {
            notifications.push({
                title,
                description,
                type: notifications_constant_1.NOTIF_TYPE.TENANT_RENT_CONTRACT_PAYMENT.toString(),
                referenceId: data.contractPaymentCode.toString(),
                isRead: false,
                user: user,
            });
        }
        const res = await entityManager.save(Notifications_1.Notifications, notifications);
        const notificationsIds = res.map((x) => x.notificationId);
        await this.pusherService.sendNotif(users.map((x) => x.userId), title, description);
        return notificationsIds;
    }
    async syncRealTime(userIds, data) {
        await this.pusherService.paymentChanges(userIds, data);
    }
};
ContractPaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ContractPayment_1.ContractPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService,
        one_signal_notification_service_1.OneSignalNotificationService])
], ContractPaymentService);
exports.ContractPaymentService = ContractPaymentService;
//# sourceMappingURL=contract-payment.service.js.map