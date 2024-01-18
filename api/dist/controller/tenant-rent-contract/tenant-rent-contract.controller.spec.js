"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tenant_rent_contract_controller_1 = require("./tenant-rent-contract.controller");
describe("TenantRentContractController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [tenant_rent_contract_controller_1.TenantRentContractController],
        }).compile();
        controller = module.get(tenant_rent_contract_controller_1.TenantRentContractController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=tenant-rent-contract.controller.spec.js.map