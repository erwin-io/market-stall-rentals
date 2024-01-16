"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const express = require("express");
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
const typeOrmConfig = __importStar(require("./db/typeorm"));
const users_1 = require("./controllers/users");
const roles_1 = require("./controllers/roles");
const app = express();
const cors = require('cors');
app.use(cors({
    origin: "*",
}));
if (!process.env.NODE_ENV) {
    dotenv.config({ path: path.resolve(__dirname, "./envs/development.env") });
}
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const dbConfig = typeOrmConfig.createConfig();
(0, typeorm_1.createConnection)(dbConfig)
    .then(async (connection) => {
    console.log("Connected to DB");
})
    .catch((error) => console.log("TypeORM connection error: ", error));
const routePrefix = "api/";
app.use("/" + routePrefix + "users", users_1.usersRouter);
app.use("/" + routePrefix + "roles", roles_1.rolesRouter);
app.use((req, res, next) => {
    const error = new Error("not found");
    return res.status(404).json({
        message: error.message,
    });
});
const httpServer = http.createServer(app);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT} use this link http://localhost:${PORT}/${routePrefix}`));
//# sourceMappingURL=server.js.map