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
exports.Files = void 0;
const typeorm_1 = require("typeorm");
const StallClassifications_1 = require("./StallClassifications");
const UserProfilePic_1 = require("./UserProfilePic");
let Files = class Files {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "FileId" }),
    __metadata("design:type", String)
], Files.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "FileName" }),
    __metadata("design:type", String)
], Files.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "Url", nullable: true }),
    __metadata("design:type", String)
], Files.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StallClassifications_1.StallClassifications, (stallClassifications) => stallClassifications.thumbnailFile),
    __metadata("design:type", Array)
], Files.prototype, "stallClassifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserProfilePic_1.UserProfilePic, (userProfilePic) => userProfilePic.file),
    __metadata("design:type", Array)
], Files.prototype, "userProfilePics", void 0);
Files = __decorate([
    (0, typeorm_1.Index)("pk_files_901578250", ["fileId"], { unique: true }),
    (0, typeorm_1.Entity)("Files", { schema: "dbo" })
], Files);
exports.Files = Files;
//# sourceMappingURL=Files.js.map