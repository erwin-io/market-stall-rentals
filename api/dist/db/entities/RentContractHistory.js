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
exports.RentContractHistory = void 0;
const typeorm_1 = require("typeorm");
const TenantRentContract_1 = require("./TenantRentContract");
let RentContractHistory = class RentContractHistory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "RentContractHistoryId" }),
    __metadata("design:type", String)
], RentContractHistory.prototype, "rentContractHistoryId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateChanged",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], RentContractHistory.prototype, "dateChanged", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "Date",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], RentContractHistory.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateRenew",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], RentContractHistory.prototype, "dateRenew", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "StallRentAmount", default: () => "0" }),
    __metadata("design:type", String)
], RentContractHistory.prototype, "stallRentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "OtherCharges", default: () => "0" }),
    __metadata("design:type", String)
], RentContractHistory.prototype, "otherCharges", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalRentAmount", default: () => "0" }),
    __metadata("design:type", String)
], RentContractHistory.prototype, "totalRentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status" }),
    __metadata("design:type", String)
], RentContractHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RenewStatus" }),
    __metadata("design:type", String)
], RentContractHistory.prototype, "renewStatus", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TenantRentContract_1.TenantRentContract, (tenantRentContract) => tenantRentContract.rentContractHistories),
    (0, typeorm_1.JoinColumn)([
        {
            name: "TenantRentContractId",
            referencedColumnName: "tenantRentContractId",
        },
    ]),
    __metadata("design:type", TenantRentContract_1.TenantRentContract)
], RentContractHistory.prototype, "tenantRentContract", void 0);
RentContractHistory = __decorate([
    (0, typeorm_1.Index)("RentContractHistory_pkey", ["rentContractHistoryId"], { unique: true }),
    (0, typeorm_1.Entity)("RentContractHistory", { schema: "dbo" })
], RentContractHistory);
exports.RentContractHistory = RentContractHistory;
//# sourceMappingURL=RentContractHistory.js.map