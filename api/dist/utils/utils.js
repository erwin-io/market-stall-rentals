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
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = exports.AESDecrypt = exports.AESEncrypt = exports.round = void 0;
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const round = (number) => {
    return Math.round((number + Number.EPSILON) * 100);
};
exports.round = round;
const AESEncrypt = async (value) => {
    const crypto = require("crypto");
    const algorithm = "aes-256-cbc";
    const initVector = crypto
        .createHash("sha512")
        .update(fs.readFileSync(path.join(__dirname, "./../../private.key")))
        .digest("hex")
        .substring(0, 16);
    const Securitykey = crypto
        .createHash("sha512")
        .update(fs.readFileSync(path.join(__dirname, "./../../private.key")))
        .digest("hex")
        .substring(0, 32);
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    return Buffer.from(cipher.update(value, "utf8", "hex") + cipher.final("hex")).toString("base64");
};
exports.AESEncrypt = AESEncrypt;
const AESDecrypt = async (value) => {
    const crypto = require("crypto");
    const algorithm = "aes-256-cbc";
    const initVector = crypto
        .createHash("sha512")
        .update(fs.readFileSync(path.join(__dirname, "./../../private.key")))
        .digest("hex")
        .substring(0, 16);
    const Securitykey = crypto
        .createHash("sha512")
        .update(fs.readFileSync(path.join(__dirname, "./../../private.key")))
        .digest("hex")
        .substring(0, 32);
    const buff = Buffer.from(value, "base64");
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    return (decipher.update(buff.toString("utf8"), "hex", "utf8") +
        decipher.final("utf8"));
};
exports.AESDecrypt = AESDecrypt;
const hash = async (value) => {
    return await bcrypt.hash(value, 10);
};
exports.hash = hash;
const compare = async (newValue, hashedValue) => {
    return await bcrypt.compare(hashedValue, newValue);
};
exports.compare = compare;
//# sourceMappingURL=utils.js.map