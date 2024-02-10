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
exports.Stalls = void 0;
const typeorm_1 = require("typeorm");
const StallRate_1 = require("./StallRate");
const StallClassifications_1 = require("./StallClassifications");
const TenantRentBooking_1 = require("./TenantRentBooking");
const TenantRentContract_1 = require("./TenantRentContract");
let Stalls = class Stalls {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "StallId" }),
    __metadata("design:type", String)
], Stalls.prototype, "stallId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "StallCode", nullable: true }),
    __metadata("design:type", String)
], Stalls.prototype, "stallCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], Stalls.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "AreaName" }),
    __metadata("design:type", String)
], Stalls.prototype, "areaName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'AVAILABLE'" }),
    __metadata("design:type", String)
], Stalls.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Stalls.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateAdded",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], Stalls.prototype, "dateAdded", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Stalls.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "MonthlyRate", default: () => "0" }),
    __metadata("design:type", String)
], Stalls.prototype, "monthlyRate", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "WeeklyRate", default: () => "0" }),
    __metadata("design:type", String)
], Stalls.prototype, "weeklyRate", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "DailyRate", default: () => "0" }),
    __metadata("design:type", String)
], Stalls.prototype, "dailyRate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StallRate_1.StallRate, (stallRate) => stallRate.stall),
    __metadata("design:type", Array)
], Stalls.prototype, "stallRates", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => StallClassifications_1.StallClassifications, (stallClassifications) => stallClassifications.stalls),
    (0, typeorm_1.JoinColumn)([
        {
            name: "StallClassificationId",
            referencedColumnName: "stallClassificationId",
        },
    ]),
    __metadata("design:type", StallClassifications_1.StallClassifications)
], Stalls.prototype, "stallClassification", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TenantRentBooking_1.TenantRentBooking, (tenantRentBooking) => tenantRentBooking.stall),
    __metadata("design:type", Array)
], Stalls.prototype, "tenantRentBookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TenantRentContract_1.TenantRentContract, (tenantRentContract) => tenantRentContract.stall),
    __metadata("design:type", Array)
], Stalls.prototype, "tenantRentContracts", void 0);
Stalls = __decorate([
    (0, typeorm_1.Index)("u_stall", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("u_stallcode", ["active", "stallCode"], { unique: true }),
    (0, typeorm_1.Index)("Stalls_pkey", ["stallId"], { unique: true }),
    (0, typeorm_1.Entity)("Stalls", { schema: "dbo" })
], Stalls);
exports.Stalls = Stalls;
//# sourceMappingURL=Stalls.js.map