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
exports.ContractPayment = void 0;
const typeorm_1 = require("typeorm");
const ContractBilling_1 = require("./ContractBilling");
const Users_1 = require("./Users");
let ContractPayment = class ContractPayment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "ContractPaymentId" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "contractPaymentId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ContractPaymentCode", nullable: true }),
    __metadata("design:type", String)
], ContractPayment.prototype, "contractPaymentCode", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateCreated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], ContractPayment.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DatePaid",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], ContractPayment.prototype, "datePaid", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalBillAmount", default: () => "0" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "totalBillAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "PaymentAmount", default: () => "0" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "paymentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ContractBilling_1.ContractBilling, (contractBilling) => contractBilling.contractPayments),
    (0, typeorm_1.JoinColumn)([
        { name: "ContractBillingId", referencedColumnName: "contractBillingId" },
    ]),
    __metadata("design:type", ContractBilling_1.ContractBilling)
], ContractPayment.prototype, "contractBilling", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.contractPayments),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], ContractPayment.prototype, "user", void 0);
ContractPayment = __decorate([
    (0, typeorm_1.Index)("ContractPayment_pkey", ["contractPaymentId"], { unique: true }),
    (0, typeorm_1.Entity)("ContractPayment", { schema: "dbo" })
], ContractPayment);
exports.ContractPayment = ContractPayment;
//# sourceMappingURL=ContractPayment.js.map