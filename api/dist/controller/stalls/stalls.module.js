"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StallModule = void 0;
const common_1 = require("@nestjs/common");
const stalls_controller_1 = require("./stalls.controller");
const Stalls_1 = require("../../db/entities/Stalls");
const stalls_service_1 = require("../../services/stalls.service");
const typeorm_1 = require("@nestjs/typeorm");
let StallModule = class StallModule {
};
StallModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Stalls_1.Stalls])],
        controllers: [stalls_controller_1.StallController],
        providers: [stalls_service_1.StallsService],
        exports: [stalls_service_1.StallsService],
    })
], StallModule);
exports.StallModule = StallModule;
//# sourceMappingURL=stalls.module.js.map