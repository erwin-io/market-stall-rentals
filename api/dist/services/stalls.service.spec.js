"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const stalls_service_1 = require("./stalls.service");
describe('StallsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [stalls_service_1.StallsService],
        }).compile();
        service = module.get(stalls_service_1.StallsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=stalls.service.spec.js.map