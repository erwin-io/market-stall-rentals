"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractPaymentModule = void 0;
const common_1 = require("@nestjs/common");
const ContractPayment_1 = require("../../db/entities/ContractPayment");
const contract_payment_service_1 = require("../../services/contract-payment.service");
const typeorm_1 = require("@nestjs/typeorm");
const contract_payment_controller_1 = require("./contract-payment.controller");
const pusher_service_1 = require("../../services/pusher.service");
const axios_1 = require("@nestjs/axios");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
let ContractPaymentModule = class ContractPaymentModule {
};
ContractPaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, typeorm_1.TypeOrmModule.forFeature([ContractPayment_1.ContractPayment])],
        controllers: [contract_payment_controller_1.ContractPaymentController],
        providers: [
            contract_payment_service_1.ContractPaymentService,
            pusher_service_1.PusherService,
            one_signal_notification_service_1.OneSignalNotificationService,
        ],
        exports: [
            contract_payment_service_1.ContractPaymentService,
            pusher_service_1.PusherService,
            one_signal_notification_service_1.OneSignalNotificationService,
        ],
    })
], ContractPaymentModule);
exports.ContractPaymentModule = ContractPaymentModule;
//# sourceMappingURL=contract-payment.module.js.map