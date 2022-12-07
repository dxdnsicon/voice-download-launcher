"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("./axios"));
const task_config_1 = require("../config/task-config");
const logger_1 = __importDefault(require("../launcher/logger"));
exports.default = async (data) => {
    try {
        (0, axios_1.default)({
            url: task_config_1.JW_SERVER_API,
            method: 'post',
            data: {
                "data": {
                    "noLogin": true,
                    "getData": {
                        "module": "sql.uitest",
                        "method": "reportUitestProcess",
                        "params": data
                    }
                }
            }
        });
    }
    catch (e) {
        logger_1.default.info(`reportUitestProcess: ${e}`);
    }
};
//# sourceMappingURL=reportUitestProcess.js.map