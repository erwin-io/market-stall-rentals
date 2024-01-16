"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StallClassificationsModule = void 0;
const common_1 = require("@nestjs/common");
const stall_classifications_controller_1 = require("./stall-classifications.controller");
const StallClassifications_1 = require("../../db/entities/StallClassifications");
const stall_classifications_service_1 = require("../../services/stall-classifications.service");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
let StallClassificationsModule = class StallClassificationsModule {
};
StallClassificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            typeorm_1.TypeOrmModule.forFeature([StallClassifications_1.StallClassifications]),
        ],
        controllers: [stall_classifications_controller_1.StallClassificationsController],
        providers: [stall_classifications_service_1.StallClassificationsService],
        exports: [stall_classifications_service_1.StallClassificationsService],
    })
], StallClassificationsModule);
exports.StallClassificationsModule = StallClassificationsModule;
//# sourceMappingURL=stall-classifications.module.js.map