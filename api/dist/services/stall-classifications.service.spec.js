"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const stall_classifications_service_1 = require("./stall-classifications.service");
describe('StallClassificationsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [stall_classifications_service_1.StallClassificationsService],
        }).compile();
        service = module.get(stall_classifications_service_1.StallClassificationsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=stall-classifications.service.spec.js.map