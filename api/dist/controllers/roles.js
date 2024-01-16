"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesRouter = void 0;
const express_1 = require("express");
const Roles_1 = require("../../src/db/entities/Roles");
const typeorm_1 = require("typeorm");
exports.rolesRouter = (0, express_1.Router)();
exports.rolesRouter.get("/", async (req, res, next) => {
    try {
        let roless = await (0, typeorm_1.getRepository)(Roles_1.Roles).find({
            where: {
                active: true
            }
        });
        return res.status(200).json({
            data: roless,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
});
exports.rolesRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        let roles = await (0, typeorm_1.getRepository)(Roles_1.Roles).findOne({
            where: {
                roleId: id,
                active: true
            },
        });
        return res.status(200).json({
            message: roles,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
});
exports.rolesRouter.post("/", async (req, res, next) => {
    try {
        if (req.body && req.body.name) {
            const { name } = req.body;
            let roles = new Roles_1.Roles();
            roles.name = name.toString().toUpperCase();
            roles = await (0, typeorm_1.getManager)().transaction(async (transactionalEntityManager) => {
                return await transactionalEntityManager.save(roles);
            });
            return res.status(200).json({
                data: roles,
            });
        }
        else {
            return res.status(404).json({
                message: "Bad Request!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
});
exports.rolesRouter.put("/:id", async (req, res, next) => {
    try {
        if (req.body && req.body.name && req.params && req.params.id) {
            let { name, id } = Object.assign(Object.assign({}, req.body), req.params);
            let roles = await (0, typeorm_1.getRepository)(Roles_1.Roles).findOne({
                where: {
                    roleId: id,
                    active: true
                },
            });
            if (roles) {
                roles.name = name.toString().toUpperCase();
                roles = await (0, typeorm_1.getManager)().transaction(async (transactionalEntityManager) => {
                    return await transactionalEntityManager.save(roles);
                });
                return res.status(200).json({
                    message: "roles updated successfully",
                    data: roles,
                });
            }
            else {
                return res.status(404).json({
                    message: "Not Found!",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Bad request!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
});
exports.rolesRouter.delete("/:id", async (req, res, next) => {
    try {
        if (req.params && req.params.id) {
            let { id } = req.params;
            let roles = await (0, typeorm_1.getRepository)(Roles_1.Roles).findOne({
                where: {
                    roleId: id,
                    active: true
                },
            });
            if (roles) {
                roles.active = false;
                roles = await (0, typeorm_1.getManager)().transaction(async (transactionalEntityManager) => {
                    return await transactionalEntityManager.save(roles);
                });
                return res.status(200).json({
                    message: "roles deleted successfully",
                    data: roles,
                });
            }
            else {
                return res.status(404).json({
                    message: "Not Found!",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Bad request!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
});
//# sourceMappingURL=roles.js.map