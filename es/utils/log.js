"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const time_1 = __importDefault(require("../utils/time"));
const color = ['\x1B[31m%s\x1B[0m', '\x1B[36m%s\x1B[0m', '\x1B[32m%s\x1B[0m', '\x1B[33m%s\x1B[0m', '\x1B[34m%s\x1B[0m', '\x1B[35m%s\x1B[0m', '\x1B[41m%s\x1B[0m', '\x1B[42m%s\x1B[0m', '\x1B[43m%s\x1B[0m', '\x1B[44m%s\x1B[0m', '\x1B[45m%s\x1B[0m', '\x1B[46m%s\x1B[0m',];
function default_1(...args) {
    if (global.page) {
        console.log(color[global.page - 1], `${(0, time_1.default)(new Date(), 'yyyy-MM-dd hh:mm:ss')}-child${global.page}:`, ...args);
    }
    else {
        console.log(`${(0, time_1.default)(new Date(), 'yyyy-MM-dd hh:mm:ss')}: `, ...args);
    }
}
exports.default = default_1;
//# sourceMappingURL=log.js.map