"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_response_1 = __importDefault(require("./page_response"));
const page_error_1 = __importDefault(require("./page_error"));
exports.default = (page, errorFileList, largeFileList, errorMessageList) => {
    page.on('response', async (res) => {
        (0, page_response_1.default)(res, errorFileList, largeFileList);
    });
    let alreadyErrorFirstLine = [];
    page.on('pageerror', (err) => {
        (err === null || err === void 0 ? void 0 : err.message) && (0, page_error_1.default)(err.message, errorMessageList, alreadyErrorFirstLine);
    });
    return { errorFileList, largeFileList, errorMessageList };
};
//# sourceMappingURL=monitor.js.map