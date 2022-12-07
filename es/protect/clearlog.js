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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_config_1 = require("../config/task-config");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const log_1 = __importDefault(require("../utils/log"));
const clearFile = (thePath) => {
    try {
        const now = new Date().valueOf();
        fs.readdirSync(thePath).forEach(function (name) {
            var filePath = path_1.default.join(thePath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                const createTime = new Date(stat.ctime).valueOf();
                if (now - createTime >= task_config_1.CLEAR_DURATION) {
                    (0, log_1.default)('clearLogFile', filePath);
                    fs.unlinkSync(filePath);
                }
            }
        });
    }
    catch (e) {
        (0, log_1.default)('clearTask error', e);
    }
};
function default_1() {
    clearFile(task_config_1.LOG_PATH);
}
exports.default = default_1;
//# sourceMappingURL=clearlog.js.map