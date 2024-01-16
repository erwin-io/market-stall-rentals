"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const stalls_controller_1 = require("./stalls.controller");
describe("StallController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [stalls_controller_1.StallController],
        }).compile();
        controller = module.get(stalls_controller_1.StallController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=stalls.controller.spec.js.map