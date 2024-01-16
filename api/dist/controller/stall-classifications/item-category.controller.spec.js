"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const stall_classifications_controller_1 = require("./stall-classifications.controller");
describe("ItemCategoryController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [stall_classifications_controller_1.ItemCategoryController],
        }).compile();
        controller = module.get(stall_classifications_controller_1.ItemCategoryController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=item-category.controller.spec.js.map