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
exports.TenantRentContracts = void 0;
const typeorm_1 = require("typeorm");
const ContractBilling_1 = require("./ContractBilling");
const RentContractHistory_1 = require("./RentContractHistory");
const Stalls_1 = require("./Stalls");
const Users_1 = require("./Users");
let TenantRentContracts = class TenantRentContracts {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "TenantRentContractId" }),
    __metadata("design:type", String)
], TenantRentContracts.prototype, "tenantRentContractId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "TenantRentContractCode",
        nullable: true,
    }),
    __metadata("design:type", String)
], TenantRentContracts.prototype, "tenantRentContractCode", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateCreated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], TenantRentContracts.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], TenantRentContracts.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateStart",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], TenantRentContracts.prototype, "dateStart", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateRenew", nullable: true }),
    __metadata("design:type", Date)
], TenantRentContracts.prototype, "dateRenew", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "StallRentAmount", default: () => "0" }),
    __metadata("design:type", String)
], TenantRentContracts.prototype, "stallRentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "OtherCharges", default: () => "0" }),
    __metadata("design:type", String)
], TenantRentContracts.prototype, "otherCharges", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalRentAmount", default: () => "0" }),
    __metadata("design:type", String)
], TenantRentContracts.prototype, "totalRentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'ACTIVE'" }),
    __metadata("design:type", String)
], TenantRentContracts.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RenewStatus", nullable: true }),
    __metadata("design:type", String)
], TenantRentContracts.prototype, "renewStatus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ContractBilling_1.ContractBilling, (contractBilling) => contractBilling.tenantRentContract),
    __metadata("design:type", Array)
], TenantRentContracts.prototype, "contractBillings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RentContractHistory_1.RentContractHistory, (rentContractHistory) => rentContractHistory.tenantRentContract),
    __metadata("design:type", Array)
], TenantRentContracts.prototype, "rentContractHistories", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Stalls_1.Stalls, (stalls) => stalls.tenantRentContracts),
    (0, typeorm_1.JoinColumn)([{ name: "StallId", referencedColumnName: "stallId" }]),
    __metadata("design:type", Stalls_1.Stalls)
], TenantRentContracts.prototype, "stall", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.tenantRentContracts),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], TenantRentContracts.prototype, "user", void 0);
TenantRentContracts = __decorate([
    (0, typeorm_1.Index)("TenantRentContracts_pkey", ["tenantRentContractId"], { unique: true }),
    (0, typeorm_1.Entity)("TenantRentContracts", { schema: "dbo" })
], TenantRentContracts);
exports.TenantRentContracts = TenantRentContracts;
//# sourceMappingURL=TenantRentContracts.js.map