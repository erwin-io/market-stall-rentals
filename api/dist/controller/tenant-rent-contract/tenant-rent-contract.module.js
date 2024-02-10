"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRentContractModule = void 0;
const common_1 = require("@nestjs/common");
const tenant_rent_contract_controller_1 = require("./tenant-rent-contract.controller");
const TenantRentContract_1 = require("../../db/entities/TenantRentContract");
const tenant_rent_contract_service_1 = require("../../services/tenant-rent-contract.service");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
const pusher_service_1 = require("../../services/pusher.service");
let TenantRentContractModule = class TenantRentContractModule {
};
TenantRentContractModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([TenantRentContract_1.TenantRentContract]),
        ],
        controllers: [tenant_rent_contract_controller_1.TenantRentContractController],
        providers: [
            tenant_rent_contract_service_1.TenantRentContractService,
            pusher_service_1.PusherService,
            one_signal_notification_service_1.OneSignalNotificationService,
        ],
        exports: [
            tenant_rent_contract_service_1.TenantRentContractService,
            pusher_service_1.PusherService,
            one_signal_notification_service_1.OneSignalNotificationService,
        ],
    })
], TenantRentContractModule);
exports.TenantRentContractModule = TenantRentContractModule;
//# sourceMappingURL=tenant-rent-contract.module.js.map