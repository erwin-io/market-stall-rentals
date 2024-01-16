"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const Users_1 = require("../../src/db/entities/Users");
const typeorm_1 = require("typeorm");
const Roles_1 = require("../../src/db/entities/Roles");
const constant_1 = require("../utils/constant");
const utils_1 = require("../utils/utils");
var cors = require('cors');
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get("/", async (req, res, next) => {
    try {
        let users = await (0, typeorm_1.getRepository)(Users_1.Users).find({
            where: {
                active: true
            }
        });
        return res.status(200).json({
            data: users.map(x => {
                delete x.password;
                return x;
            }),
            success: true
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
});
exports.usersRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        let user = await (0, typeorm_1.getRepository)(Users_1.Users).findOne({
            where: {
                userId: id,
                active: true
            },
        });
        if (user) {
            delete user.password;
            return res.status(200).json({
                data: user,
                success: true
            });
        }
        else {
            return res.status(404).json({
                message: "Not found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
});
exports.usersRouter.post("/login", async (req, res, next) => {
    try {
        if (req.body &&
            req.body.mobileNumber &&
            req.body.password) {
            const { mobileNumber, password } = req.body;
            let user = await (0, typeorm_1.getRepository)(Users_1.Users).findOne({
                where: {
                    mobileNumber,
                    active: true
                },
            });
            const equal = await (0, utils_1.compare)(user.password, password);
            if (user && equal) {
                delete user.password;
                return res.status(200).json({
                    data: user,
                    success: true
                });
            }
            else {
                return res.status(404).json({
                    message: "Not found!",
                });
            }
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
exports.usersRouter.post("/", async (req, res, next) => {
    try {
        if (req.body &&
            req.body.name &&
            req.body.mobileNumber &&
            req.body.password &&
            req.body.userType &&
            (constant_1.CONST_USERTYPE.some(x => req.body.userType.toString().toUpperCase() === x.toUpperCase()))) {
            const { name, mobileNumber, password, userType, roles } = req.body;
            let user = new Users_1.Users();
            user.name = name;
            user.mobileNumber = mobileNumber;
            user.password = await (0, utils_1.hash)(password);
            user.userType = userType.toString().toUpperCase();
            if (roles && roles.length > 0) {
                const dbRoles = await (0, typeorm_1.getRepository)(Roles_1.Roles).find({
                    where: {
                        roleId: (0, typeorm_1.In)(roles),
                        active: true
                    },
                });
                if (roles.length && roles.length != dbRoles.length) {
                    return res.status(404).json({
                        message: "Bad Request!",
                    });
                }
            }
            user.roles = roles;
            user = await (0, typeorm_1.getManager)().transaction(async (transactionalEntityManager) => {
                return await transactionalEntityManager.save(user);
            });
            delete user.password;
            return res.status(200).json({
                data: user,
                success: true
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
exports.usersRouter.put("/:id", async (req, res, next) => {
    try {
        if (req.params &&
            req.params.id &&
            req.body &&
            req.body.name) {
            let { name, id } = Object.assign(Object.assign({}, req.body), req.params);
            let user = await (0, typeorm_1.getRepository)(Users_1.Users).findOne({
                where: {
                    userId: id,
                    active: true
                },
            });
            if (user) {
                user.name = name;
                user = await (0, typeorm_1.getManager)().transaction(async (transactionalEntityManager) => {
                    return await transactionalEntityManager.save(user);
                });
                delete user.password;
                return res.status(200).json({
                    message: "user updated successfully",
                    data: user,
                    success: true
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
exports.usersRouter.put("/:id/changePassword", async (req, res, next) => {
    try {
        if (req.params &&
            req.params.id &&
            req.body &&
            req.body.password) {
            let { password, id } = Object.assign(Object.assign({}, req.body), req.params);
            let user = await (0, typeorm_1.getRepository)(Users_1.Users).findOne({
                where: {
                    userId: id,
                    active: true
                },
            });
            if (user) {
                user.password = await (0, utils_1.hash)(password);
                user = await (0, typeorm_1.getManager)().transaction(async (transactionalEntityManager) => {
                    return await transactionalEntityManager.save(user);
                });
                delete user.password;
                return res.status(200).json({
                    message: "user updated successfully",
                    data: user,
                    success: true
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
exports.usersRouter.delete("/:id", async (req, res, next) => {
    try {
        if (req.params && req.params.id) {
            let { id } = req.params;
            let user = await (0, typeorm_1.getRepository)(Users_1.Users).findOne({
                where: {
                    userId: id,
                    active: true
                },
            });
            if (user) {
                delete user.password;
                user.active = false;
                user = await (0, typeorm_1.getManager)().transaction(async (transactionalEntityManager) => {
                    return await transactionalEntityManager.save(user);
                });
                return res.status(200).json({
                    message: "user deleted successfully",
                    data: user,
                    success: true
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
//# sourceMappingURL=users.js.map