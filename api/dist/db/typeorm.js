"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = void 0;
require("reflect-metadata");
const SystemConfig_1 = require("../../src/db/entities/SystemConfig");
const Users_1 = require("../../src/db/entities/Users");
const Roles_1 = require("../../src/db/entities/Roles");
function createConfig() {
    const ssl = process.env.SSL;
    const config = {
        type: "postgres",
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        entities: [SystemConfig_1.SystemConfig, Users_1.Users, Roles_1.Roles],
        synchronize: false,
        ssl: ssl.toLocaleLowerCase().includes("true"),
        extra: {}
    };
    if (config.ssl) {
        config.extra.ssl = {
            require: true,
            rejectUnauthorized: false,
        };
    }
    return config;
}
exports.createConfig = createConfig;
//# sourceMappingURL=typeorm.js.map