"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const contract_payment_controller_1 = require("./contract-payment.controller");
describe("ContractPaymentController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [contract_payment_controller_1.ContractPaymentController],
        }).compile();
        controller = module.get(contract_payment_controller_1.ContractPaymentController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=contract-payment.controller.spec.js.map