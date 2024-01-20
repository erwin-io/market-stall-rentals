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
exports.TenantRentContract = void 0;
const typeorm_1 = require("typeorm");
const ContractBilling_1 = require("./ContractBilling");
const RentContractHistory_1 = require("./RentContractHistory");
const Stalls_1 = require("./Stalls");
const Users_1 = require("./Users");
let TenantRentContract = class TenantRentContract {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "TenantRentContractId" }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "tenantRentContractId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "TenantRentContractCode",
        nullable: true,
    }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "tenantRentContractCode", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateCreated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], TenantRentContract.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], TenantRentContract.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("date", {
        name: "DateStart",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "dateStart", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateRenew", nullable: true }),
    __metadata("design:type", Date)
], TenantRentContract.prototype, "dateRenew", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "StallRentAmount", default: () => "0" }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "stallRentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "OtherCharges", default: () => "0" }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "otherCharges", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalRentAmount", default: () => "0" }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "totalRentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'ACTIVE'" }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RenewStatus", nullable: true }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "renewStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "StallRateCode" }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "stallRateCode", void 0);
__decorate([
    (0, typeorm_1.Column)("date", {
        name: "CurrentDueDate",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", String)
], TenantRentContract.prototype, "currentDueDate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ContractBilling_1.ContractBilling, (contractBilling) => contractBilling.tenantRentContract),
    __metadata("design:type", Array)
], TenantRentContract.prototype, "contractBillings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RentContractHistory_1.RentContractHistory, (rentContractHistory) => rentContractHistory.tenantRentContract),
    __metadata("design:type", Array)
], TenantRentContract.prototype, "rentContractHistories", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Stalls_1.Stalls, (stalls) => stalls.tenantRentContracts),
    (0, typeorm_1.JoinColumn)([{ name: "StallId", referencedColumnName: "stallId" }]),
    __metadata("design:type", Stalls_1.Stalls)
], TenantRentContract.prototype, "stall", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.tenantRentContracts),
    (0, typeorm_1.JoinColumn)([{ name: "TenantUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], TenantRentContract.prototype, "tenantUser", void 0);
TenantRentContract = __decorate([
    (0, typeorm_1.Index)("TenantRentContracts_pkey", ["tenantRentContractId"], { unique: true }),
    (0, typeorm_1.Entity)("TenantRentContract", { schema: "dbo" })
], TenantRentContract);
exports.TenantRentContract = TenantRentContract;
//# sourceMappingURL=TenantRentContract.js.map