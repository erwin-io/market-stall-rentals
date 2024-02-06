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
const TenantRentContract_1 = require("./TenantRentContract");
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
    (0, typeorm_1.Column)("character varying", { name: "ReferenceNumber" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateCreated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], ContractPayment.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("date", {
        name: "DatePaid",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", String)
], ContractPayment.prototype, "datePaid", void 0);
__decorate([
    (0, typeorm_1.Column)("date", {
        name: "DueDateStart",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", String)
], ContractPayment.prototype, "dueDateStart", void 0);
__decorate([
    (0, typeorm_1.Column)("date", {
        name: "DueDateEnd",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", String)
], ContractPayment.prototype, "dueDateEnd", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "DueAmount", default: () => "0" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "dueAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "OverDueAmount", default: () => "0" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "overDueAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalDueAmount", default: () => "0" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "totalDueAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "PaymentAmount", default: () => "0" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "paymentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status" }),
    __metadata("design:type", String)
], ContractPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TenantRentContract_1.TenantRentContract, (tenantRentContract) => tenantRentContract.contractPayments),
    (0, typeorm_1.JoinColumn)([
        {
            name: "TenantRentContractId",
            referencedColumnName: "tenantRentContractId",
        },
    ]),
    __metadata("design:type", TenantRentContract_1.TenantRentContract)
], ContractPayment.prototype, "tenantRentContract", void 0);
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