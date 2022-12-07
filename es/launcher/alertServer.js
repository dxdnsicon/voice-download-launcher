"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertServer = void 0;
const jingwei_common_lib_1 = require("@tencent/jingwei-common-lib");
const logger_1 = __importDefault(require("./logger"));
const task_config_1 = require("../config/task-config");
exports.alertServer = (0, jingwei_common_lib_1.alertService)(`http://${task_config_1.JINGWEI_DOMAIN}/backend/api/v1/alert`, logger_1.default);
//# sourceMappingURL=alertServer.js.map