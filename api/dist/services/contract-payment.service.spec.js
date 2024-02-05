"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const contract_payment_service_1 = require("./contract-payment.service");
describe('ContractPaymentService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [contract_payment_service_1.ContractPaymentService],
        }).compile();
        service = module.get(contract_payment_service_1.ContractPaymentService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=contract-payment.service.spec.js.map