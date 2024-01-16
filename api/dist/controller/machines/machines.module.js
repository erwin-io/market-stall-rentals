"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachinesModule = void 0;
const common_1 = require("@nestjs/common");
const machines_controller_1 = require("./machines.controller");
const Machines_1 = require("src/db/entities/Machines");
const machines_service_1 = require("src/services/machines.service");
const typeorm_1 = require("@nestjs/typeorm");
let MachinesModule = class MachinesModule {
};
MachinesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Machines_1.Machines])],
        controllers: [machines_controller_1.MachinesController],
        providers: [machines_service_1.MachinesService],
        exports: [machines_service_1.MachinesService],
    })
], MachinesModule);
exports.MachinesModule = MachinesModule;
//# sourceMappingURL=machines.module.js.map