"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tenant_rent_contract_service_1 = require("./tenant-rent-contract.service");
describe('TenantRentContractService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [tenant_rent_contract_service_1.TenantRentContractService],
        }).compile();
        service = module.get(tenant_rent_contract_service_1.TenantRentContractService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=tenant-rent-contract.service.spec.js.map