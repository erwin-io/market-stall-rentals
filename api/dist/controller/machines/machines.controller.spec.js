"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const machines_controller_1 = require("./machines.controller");
describe("MachinesController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [machines_controller_1.MachinesController],
        }).compile();
        controller = module.get(machines_controller_1.MachinesController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=machines.controller.spec.js.map