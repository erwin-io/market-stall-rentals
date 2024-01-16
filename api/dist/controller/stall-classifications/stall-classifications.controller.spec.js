"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const stall_classifications_controller_1 = require("./stall-classifications.controller");
describe("StallClassificationsController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [stall_classifications_controller_1.StallClassificationsController],
        }).compile();
        controller = module.get(stall_classifications_controller_1.StallClassificationsController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=stall-classifications.controller.spec.js.map