"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./components/index"));
class Debugger {
    constructor() {
        var _a;
        const debugFn = (_a = this[process.env.DEBUG_FN]) === null || _a === void 0 ? void 0 : _a.bind(this);
        debugFn ? debugFn() : console.warn(`找不到需要调试的函数 DEBUG_FN=${process.env.DEBUG_FN}`);
    }
    async startCore() {
        return await (0, index_1.default)();
    }
}
new Debugger();
//# sourceMappingURL=debug.js.map