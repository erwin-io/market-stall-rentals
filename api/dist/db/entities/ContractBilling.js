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
exports.ContractBilling = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const TenantRentContract_1 = require("./TenantRentContract");
const ContractPayment_1 = require("./ContractPayment");
let ContractBilling = class ContractBilling {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "ContractBillingId" }),
    __metadata("design:type", String)
], ContractBilling.prototype, "contractBillingId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ContractBillingCode", nullable: true }),
    __metadata("design:type", String)
], ContractBilling.prototype, "contractBillingCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], ContractBilling.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateCreated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], ContractBilling.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateBilled",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], ContractBilling.prototype, "dateBilled", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "BillAmount", default: () => "0" }),
    __metadata("design:type", String)
], ContractBilling.prototype, "billAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "OtherCharges", default: () => "0" }),
    __metadata("design:type", String)
], ContractBilling.prototype, "otherCharges", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalBillAmount", default: () => "0" }),
    __metadata("design:type", String)
], ContractBilling.prototype, "totalBillAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "PaymentAmount", default: () => "0" }),
    __metadata("design:type", String)
], ContractBilling.prototype, "paymentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'PENDING'" }),
    __metadata("design:type", String)
], ContractBilling.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.contractBillings),
    (0, typeorm_1.JoinColumn)([{ name: "AssignedCollectorId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], ContractBilling.prototype, "assignedCollector", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TenantRentContract_1.TenantRentContract, (tenantRentContract) => tenantRentContract.contractBillings),
    (0, typeorm_1.JoinColumn)([
        {
            name: "TenantRentContractId",
            referencedColumnName: "tenantRentContractId",
        },
    ]),
    __metadata("design:type", TenantRentContract_1.TenantRentContract)
], ContractBilling.prototype, "tenantRentContract", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.contractBillings2),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], ContractBilling.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ContractPayment_1.ContractPayment, (contractPayment) => contractPayment.contractBilling),
    __metadata("design:type", Array)
], ContractBilling.prototype, "contractPayments", void 0);
ContractBilling = __decorate([
    (0, typeorm_1.Index)("ContractBilling_pkey", ["contractBillingId"], { unique: true }),
    (0, typeorm_1.Entity)("ContractBilling", { schema: "dbo" })
], ContractBilling);
exports.ContractBilling = ContractBilling;
//# sourceMappingURL=ContractBilling.js.map