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
exports.TenantRentBooking = void 0;
const typeorm_1 = require("typeorm");
const Stalls_1 = require("./Stalls");
const Users_1 = require("./Users");
let TenantRentBooking = class TenantRentBooking {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "TenantRentBookingId" }),
    __metadata("design:type", String)
], TenantRentBooking.prototype, "tenantRentBookingId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "TenantRentBookingCode",
        nullable: true,
    }),
    __metadata("design:type", String)
], TenantRentBooking.prototype, "tenantRentBookingCode", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateCreated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], TenantRentBooking.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], TenantRentBooking.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("date", {
        name: "DatePreferedStart",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", String)
], TenantRentBooking.prototype, "datePreferedStart", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'PENDING'" }),
    __metadata("design:type", String)
], TenantRentBooking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Stalls_1.Stalls, (stalls) => stalls.tenantRentBookings),
    (0, typeorm_1.JoinColumn)([{ name: "StallId", referencedColumnName: "stallId" }]),
    __metadata("design:type", Stalls_1.Stalls)
], TenantRentBooking.prototype, "stall", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.tenantRentBookings),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], TenantRentBooking.prototype, "user", void 0);
TenantRentBooking = __decorate([
    (0, typeorm_1.Entity)("TenantRentBooking", { schema: "dbo" })
], TenantRentBooking);
exports.TenantRentBooking = TenantRentBooking;
//# sourceMappingURL=TenantRentBooking.js.map