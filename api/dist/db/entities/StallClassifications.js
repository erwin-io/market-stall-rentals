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
exports.StallClassifications = void 0;
const typeorm_1 = require("typeorm");
const Files_1 = require("./Files");
const Stalls_1 = require("./Stalls");
let StallClassifications = class StallClassifications {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "StallClassificationId" }),
    __metadata("design:type", String)
], StallClassifications.prototype, "stallClassificationId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "StallClassificationsCode",
        nullable: true,
    }),
    __metadata("design:type", String)
], StallClassifications.prototype, "stallClassificationsCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], StallClassifications.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Location" }),
    __metadata("design:type", String)
], StallClassifications.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], StallClassifications.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateAdded",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], StallClassifications.prototype, "dateAdded", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], StallClassifications.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Files_1.Files, (files) => files.stallClassifications),
    (0, typeorm_1.JoinColumn)([{ name: "thumbnailFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", Files_1.Files)
], StallClassifications.prototype, "thumbnailFile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Stalls_1.Stalls, (stalls) => stalls.stallClassification),
    __metadata("design:type", Array)
], StallClassifications.prototype, "stalls", void 0);
StallClassifications = __decorate([
    (0, typeorm_1.Index)("StallClassifications_pkey", ["stallClassificationId"], { unique: true }),
    (0, typeorm_1.Entity)("StallClassifications", { schema: "dbo" })
], StallClassifications);
exports.StallClassifications = StallClassifications;
//# sourceMappingURL=StallClassifications.js.map