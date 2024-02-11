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
exports.ReminderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pusher_service_1 = require("./pusher.service");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
const Users_1 = require("../db/entities/Users");
const Notifications_1 = require("../db/entities/Notifications");
const TenantRentContract_1 = require("../db/entities/TenantRentContract");
const moment_1 = __importDefault(require("moment"));
const date_constant_1 = require("../common/constant/date.constant");
const tenant_rent_contract_constant_1 = require("../common/constant/tenant-rent-contract.constant");
let ReminderService = class ReminderService {
    constructor(notificationsRepo, pusherService, oneSignalNotificationService) {
        this.notificationsRepo = notificationsRepo;
        this.pusherService = pusherService;
        this.oneSignalNotificationService = oneSignalNotificationService;
    }
    async sendDueReminder({ date }) {
        try {
            return await this.notificationsRepo.manager.transaction(async (entityManager) => {
                const dateFilter = (0, moment_1.default)(new Date(date), date_constant_1.DateConstant.DATE_LANGUAGE).format();
                const [dueToday, overDue] = await Promise.all([
                    entityManager.find(TenantRentContract_1.TenantRentContract, {
                        where: {
                            currentDueDate: (0, moment_1.default)(new Date(dateFilter)).format("YYYY-MM-DD"),
                            status: tenant_rent_contract_constant_1.TENANTRENTCONTRACT_STATUS.ACTIVE,
                        },
                        relations: {
                            tenantUser: true,
                            stall: {
                                stallClassification: true,
                            },
                        },
                    }),
                    entityManager.find(TenantRentContract_1.TenantRentContract, {
                        where: {
                            currentDueDate: (0, typeorm_2.LessThan)((0, moment_1.default)(new Date(dateFilter)).format("YYYY-MM-DD hh:mm:ss")),
                            status: tenant_rent_contract_constant_1.TENANTRENTCONTRACT_STATUS.ACTIVE,
                        },
                        relations: {
                            tenantUser: true,
                            stall: {
                                stallClassification: true,
                            },
                        },
                    }),
                ]);
                return [...dueToday, ...overDue];
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async test({ userId, title, description }) {
        try {
            const user = await this.notificationsRepo.manager.findOne(Users_1.Users, {
                where: {
                    userId,
                },
            });
            this.oneSignalNotificationService.sendToExternalUser(user.userName, {}, {}, [], title, description);
            this.pusherService.sendNotif([userId], title, description);
        }
        catch (ex) {
            throw ex;
        }
    }
};
ReminderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Notifications_1.Notifications)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService,
        one_signal_notification_service_1.OneSignalNotificationService])
], ReminderService);
exports.ReminderService = ReminderService;
//# sourceMappingURL=reminder.service.js.map