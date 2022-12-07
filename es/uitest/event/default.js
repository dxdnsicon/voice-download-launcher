"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
class DefaultEvent extends index_1.default {
    async run(props) {
        return {
            code: 0
        };
    }
}
exports.default = DefaultEvent;
//# sourceMappingURL=default.js.map