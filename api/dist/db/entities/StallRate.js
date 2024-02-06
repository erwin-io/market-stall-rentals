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
exports.StallRate = void 0;
const typeorm_1 = require("typeorm");
const Stalls_1 = require("./Stalls");
let StallRate = class StallRate {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "StallId" }),
    __metadata("design:type", String)
], StallRate.prototype, "stallId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { primary: true, name: "RateCode" }),
    __metadata("design:type", String)
], StallRate.prototype, "rateCode", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "StallRentAmount", default: () => "0" }),
    __metadata("design:type", String)
], StallRate.prototype, "stallRentAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Stalls_1.Stalls, (stalls) => stalls.stallRates),
    (0, typeorm_1.JoinColumn)([{ name: "StallId", referencedColumnName: "stallId" }]),
    __metadata("design:type", Stalls_1.Stalls)
], StallRate.prototype, "stall", void 0);
StallRate = __decorate([
    (0, typeorm_1.Index)("StallRate_pkey", ["rateCode", "stallId"], { unique: true }),
    (0, typeorm_1.Index)("u_stallrate_stall", ["rateCode", "stallId"], { unique: true }),
    (0, typeorm_1.Entity)("StallRate", { schema: "dbo" })
], StallRate);
exports.StallRate = StallRate;
//# sourceMappingURL=StallRate.js.map