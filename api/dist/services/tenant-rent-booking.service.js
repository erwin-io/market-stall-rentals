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
exports.TenantRentBookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment_1 = __importDefault(require("moment"));
const date_constant_1 = require("../common/constant/date.constant");
const notifications_constant_1 = require("../common/constant/notifications.constant");
const stalls_constant_1 = require("../common/constant/stalls.constant");
const tenant_rent_booking_constant_1 = require("../common/constant/tenant-rent-booking.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const user_type_constant_1 = require("../common/constant/user-type.constant");
const utils_1 = require("../common/utils/utils");
const Notifications_1 = require("../db/entities/Notifications");
const Stalls_1 = require("../db/entities/Stalls");
const TenantRentBooking_1 = require("../db/entities/TenantRentBooking");
const TenantRentContract_1 = require("../db/entities/TenantRentContract");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
const pusher_service_1 = require("./pusher.service");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
let TenantRentBookingService = class TenantRentBookingService {
    constructor(tenantRentBookingRepo, pusherService, oneSignalNotificationService) {
        this.tenantRentBookingRepo = tenantRentBookingRepo;
        this.pusherService = pusherService;
        this.oneSignalNotificationService = oneSignalNotificationService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.tenantRentBookingRepo.find({
                where: Object.assign({}, condition),
                skip,
                take,
                order,
                relations: {
                    stall: {
                        stallClassification: {
                            thumbnailFile: true,
                        },
                    },
                    requestedByUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            }),
            this.tenantRentBookingRepo.count({
                where: Object.assign({}, condition),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByCode(tenantRentBookingCode = "") {
        var _a;
        const result = await this.tenantRentBookingRepo.findOne({
            where: {
                tenantRentBookingCode: (_a = tenantRentBookingCode === null || tenantRentBookingCode === void 0 ? void 0 : tenantRentBookingCode.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
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
        if (!result) {
            throw Error(tenant_rent_booking_constant_1.TENANTRENTBOOKING_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.tenantRentBookingRepo.manager.transaction(async (entityManager) => {
            const tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                where: {
                    stall: {
                        stallCode: dto.stallCode,
                    },
                    tenantUser: {
                        userCode: dto.requestedByUserCode,
                    },
                    status: (0, typeorm_2.In)(["ACTIVE", "RENEWED"]),
                },
            });
            if (tenantRentContract) {
                throw Error("The tenant has a " +
                    tenantRentContract.status.toLocaleLowerCase() +
                    " booking for the selected stall.");
            }
            let tenantRentBooking = await entityManager.findOne(TenantRentBooking_1.TenantRentBooking, {
                where: {
                    stall: {
                        stallCode: dto.stallCode,
                    },
                    requestedByUser: {
                        userCode: dto.requestedByUserCode,
                    },
                    status: (0, typeorm_2.In)(["PENDING", "PROCESSING"]),
                },
            });
            if (tenantRentBooking) {
                throw Error("The tenant has a " +
                    tenantRentBooking.status.toLocaleLowerCase() +
                    " booking for the selected stall.");
            }
            else {
                tenantRentBooking = new TenantRentBooking_1.TenantRentBooking();
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            tenantRentBooking.dateCreated = timestamp;
            const datePreferedStart = (0, moment_1.default)(new Date(dto.datePreferedStart), date_constant_1.DateConstant.DATE_LANGUAGE).format("YYYY-MM-DD");
            tenantRentBooking.datePreferedStart = datePreferedStart;
            const tenant = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode: dto.requestedByUserCode,
                    userType: user_type_constant_1.USER_TYPE.TENANT,
                },
            });
            if (!tenant) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            tenantRentBooking.requestedByUser = tenant;
            const stall = await entityManager.findOne(Stalls_1.Stalls, {
                where: {
                    stallCode: dto.stallCode,
                    status: stalls_constant_1.STALL_STATUS.AVAILABLE,
                },
                relations: {
                    stallClassification: true,
                },
            });
            if (!stall) {
                throw Error(stalls_constant_1.STALL_ERROR_NOT_FOUND);
            }
            tenantRentBooking.stall = stall;
            tenantRentBooking.status = tenant_rent_booking_constant_1.TENANTRENTBOOKING_STATUS.PENDING;
            tenantRentBooking = await entityManager.save(tenantRentBooking);
            tenantRentBooking.tenantRentBookingCode = (0, utils_1.generateIndentityCode)(tenantRentBooking.tenantRentBookingId);
            const title = `New request to rent from ${tenant.fullName}!`;
            const desc = `${tenant.fullName} requested to rent ${stall.name} from ${stall.stallClassification.name}!`;
            const usersToBeNotified = await entityManager.find(Users_1.Users, {
                where: { userType: user_type_constant_1.USER_TYPE.STAFF },
            });
            const notificationIds = await this.logNotification(usersToBeNotified, tenantRentBooking, entityManager, title, desc);
            await this.syncRealTime(usersToBeNotified.map((x) => x.userId), tenantRentBooking);
            const sendToPushNotif = usersToBeNotified.map((x) => {
                return this.oneSignalNotificationService.sendToExternalUser(x.userName, "TENANT_RENT_BOOKING", tenantRentBooking.tenantRentBookingCode, notificationIds, title, desc);
            });
            const pushNotifResults = await Promise.all(sendToPushNotif);
            console.log("Push notif results ", JSON.stringify(pushNotifResults));
            tenantRentBooking = await entityManager.save(tenantRentBooking);
            return await entityManager.findOne(TenantRentBooking_1.TenantRentBooking, {
                where: {
                    tenantRentBookingCode: tenantRentBooking.tenantRentBookingCode,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                },
            });
        });
    }
    async update(tenantRentBookingCode, dto) {
        return await this.tenantRentBookingRepo.manager.transaction(async (entityManager) => {
            let tenantRentBooking = await entityManager.findOne(TenantRentBooking_1.TenantRentBooking, {
                where: {
                    tenantRentBookingCode,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    requestedByUser: true,
                },
            });
            if (!tenantRentBooking) {
                throw Error(tenant_rent_booking_constant_1.TENANTRENTBOOKING_ERROR_NOT_FOUND);
            }
            if (tenantRentBooking.status !== tenant_rent_booking_constant_1.TENANTRENTBOOKING_STATUS.PENDING) {
                throw Error("The booking was already in the state of: " +
                    tenantRentBooking.status.toLocaleLowerCase());
            }
            if (tenantRentBooking.stall.stallCode !== dto.stallCode) {
                const stall = await entityManager.findOne(Stalls_1.Stalls, {
                    where: {
                        stallCode: dto.stallCode,
                        status: stalls_constant_1.STALL_STATUS.AVAILABLE,
                    },
                });
                if (!stall) {
                    throw Error(stalls_constant_1.STALL_ERROR_NOT_FOUND);
                }
                tenantRentBooking.stall = stall;
                const tenantRentContract = await entityManager.findOne(TenantRentContract_1.TenantRentContract, {
                    where: {
                        stall: {
                            stallCode: dto.stallCode,
                        },
                        tenantUser: {
                            userCode: tenantRentBooking.requestedByUser.userCode,
                        },
                        status: (0, typeorm_2.In)(["ACTIVE", "RENEWED"]),
                    },
                });
                if (tenantRentContract) {
                    throw Error("The tenant has a " +
                        tenantRentContract.status.toLocaleLowerCase() +
                        " booking for the selected stall.");
                }
                const changedTenantRentBooking = await entityManager.findOne(TenantRentBooking_1.TenantRentBooking, {
                    where: {
                        stall: {
                            stallCode: dto.stallCode,
                        },
                        requestedByUser: {
                            userCode: tenantRentBooking.requestedByUser.userCode,
                        },
                        status: (0, typeorm_2.In)(["PENDING", "PROCESSING"]),
                    },
                });
                if (changedTenantRentBooking) {
                    throw Error("The tenant has a " +
                        changedTenantRentBooking.status.toLocaleLowerCase() +
                        " booking for the selected stall.");
                }
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            tenantRentBooking.dateCreated = timestamp;
            const datePreferedStart = (0, moment_1.default)(new Date(dto.datePreferedStart), date_constant_1.DateConstant.DATE_LANGUAGE).format("YYYY-MM-DD");
            tenantRentBooking.datePreferedStart = datePreferedStart;
            tenantRentBooking.status = tenant_rent_booking_constant_1.TENANTRENTBOOKING_STATUS.PENDING;
            tenantRentBooking = await entityManager.save(tenantRentBooking);
            return await entityManager.findOne(TenantRentBooking_1.TenantRentBooking, {
                where: {
                    tenantRentBookingCode: tenantRentBooking.tenantRentBookingCode,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    requestedByUser: true,
                },
            });
        });
    }
    async updateStatus(tenantRentBookingCode, dto) {
        return await this.tenantRentBookingRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c;
            const tenantRentBooking = await entityManager.findOne(TenantRentBooking_1.TenantRentBooking, {
                where: {
                    tenantRentBookingCode,
                },
                relations: {
                    stall: {
                        stallClassification: true,
                    },
                    requestedByUser: true,
                },
            });
            if (!tenantRentBooking) {
                throw Error(tenant_rent_booking_constant_1.TENANTRENTBOOKING_ERROR_NOT_FOUND);
            }
            if (tenantRentBooking.status !== tenant_rent_booking_constant_1.TENANTRENTBOOKING_STATUS.PENDING) {
                throw Error("The booking was already in the state of: " +
                    tenantRentBooking.status.toLocaleLowerCase());
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            tenantRentBooking.dateLastUpdated = timestamp;
            tenantRentBooking.status = dto.status;
            let title;
            let desc;
            const status = tenantRentBooking.status;
            if (status === tenant_rent_booking_constant_1.TENANTRENTBOOKING_STATUS.LEASED) {
                title = notifications_constant_1.NOTIF_TITLE.TENANT_RENT_BOOKING_LEASED;
                desc = `Your request to rent ${(_a = tenantRentBooking === null || tenantRentBooking === void 0 ? void 0 : tenantRentBooking.stall) === null || _a === void 0 ? void 0 : _a.name} has now been Approved, and the stall is now officially Leased to you!`;
            }
            else if (status === tenant_rent_booking_constant_1.TENANTRENTBOOKING_STATUS.REJECTED) {
                title = notifications_constant_1.NOTIF_TITLE.TENANT_RENT_BOOKING_REJECTED;
                desc = `Your request to rent ${(_b = tenantRentBooking === null || tenantRentBooking === void 0 ? void 0 : tenantRentBooking.stall) === null || _b === void 0 ? void 0 : _b.name} was Rejected!`;
            }
            else {
                title = `Request to rent was ${status.toLowerCase().charAt(0).toUpperCase() + status.slice(1)}`;
                desc = `Your request to rent ${(_c = tenantRentBooking === null || tenantRentBooking === void 0 ? void 0 : tenantRentBooking.stall) === null || _c === void 0 ? void 0 : _c.name} was now being ${status.toLowerCase().charAt(0).toUpperCase() + status.slice(1)}!`;
            }
            const notificationIds = await this.logNotification([tenantRentBooking.requestedByUser], tenantRentBooking, entityManager, title, desc);
            const staffUsers = await entityManager.find(Users_1.Users, {
                where: { userType: user_type_constant_1.USER_TYPE.STAFF },
            });
            if (status === tenant_rent_booking_constant_1.TENANTRENTBOOKING_STATUS.CANCELLED) {
                await this.syncRealTime([
                    ...staffUsers.map((x) => x.userId),
                    tenantRentBooking.requestedByUser.userId,
                ], tenantRentBooking);
            }
            else {
                await this.syncRealTime([tenantRentBooking.requestedByUser.userId], tenantRentBooking);
            }
            const pushNotifResults = await Promise.all([
                this.oneSignalNotificationService.sendToExternalUser(tenantRentBooking.requestedByUser.userName, "TENANT_RENT_BOOKING", tenantRentBooking.tenantRentBookingCode, notificationIds, title, desc),
            ]);
            console.log("Push notif results ", JSON.stringify(pushNotifResults));
            return await entityManager.save(TenantRentBooking_1.TenantRentBooking, tenantRentBooking);
        });
    }
    async logNotification(users, data, entityManager, title, description) {
        const notifications = [];
        for (const user of users) {
            notifications.push({
                title,
                description,
                type: notifications_constant_1.NOTIF_TYPE.TENANT_RENT_BOOKING.toString(),
                referenceId: data.tenantRentBookingCode.toString(),
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
        await this.pusherService.rentBookingChanges(userIds, data);
    }
};
TenantRentBookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(TenantRentBooking_1.TenantRentBooking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService,
        one_signal_notification_service_1.OneSignalNotificationService])
], TenantRentBookingService);
exports.TenantRentBookingService = TenantRentBookingService;
//# sourceMappingURL=tenant-rent-booking.service.js.map