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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmConfigService = void 0;
const Users_1 = require("../entities/Users");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const Access_1 = require("../entities/Access");
const Notifications_1 = require("../entities/Notifications");
const GatewayConnectedUsers_1 = require("../entities/GatewayConnectedUsers");
const StallClassifications_1 = require("../entities/StallClassifications");
const Stalls_1 = require("../entities/Stalls");
const UserProfilePic_1 = require("../entities/UserProfilePic");
const Files_1 = require("../entities/Files");
const TenantRentBooking_1 = require("../entities/TenantRentBooking");
const TenantRentContract_1 = require("../entities/TenantRentContract");
const RentContractHistory_1 = require("../entities/RentContractHistory");
const ContractBilling_1 = require("../entities/ContractBilling");
const ContractPayment_1 = require("../entities/ContractPayment");
const StallRate_1 = require("../entities/StallRate");
let TypeOrmConfigService = class TypeOrmConfigService {
    createTypeOrmOptions() {
        const ssl = this.config.get("SSL");
        const config = {
            type: "postgres",
            host: this.config.get("DATABASE_HOST"),
            port: Number(this.config.get("DATABASE_PORT")),
            database: this.config.get("DATABASE_NAME"),
            username: this.config.get("DATABASE_USER"),
            password: this.config.get("DATABASE_PASSWORD"),
            entities: [
                Users_1.Users,
                UserProfilePic_1.UserProfilePic,
                Files_1.Files,
                Access_1.Access,
                Notifications_1.Notifications,
                GatewayConnectedUsers_1.GatewayConnectedUsers,
                StallClassifications_1.StallClassifications,
                Stalls_1.Stalls,
                TenantRentBooking_1.TenantRentBooking,
                TenantRentContract_1.TenantRentContract,
                RentContractHistory_1.RentContractHistory,
                ContractBilling_1.ContractBilling,
                ContractPayment_1.ContractPayment,
                StallRate_1.StallRate,
                ContractPayment_1.ContractPayment,
            ],
            synchronize: false,
            ssl: ssl.toLocaleLowerCase().includes("true"),
            extra: {},
        };
        if (config.ssl) {
            config.extra.ssl = {
                require: true,
                rejectUnauthorized: false,
            };
        }
        return config;
    }
};
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], TypeOrmConfigService.prototype, "config", void 0);
TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)()
], TypeOrmConfigService);
exports.TypeOrmConfigService = TypeOrmConfigService;
//# sourceMappingURL=typeorm.service.js.map