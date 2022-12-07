"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("./axios"));
const task_config_1 = require("../config/task-config");
exports.default = (Fpage_url, content, type = '1') => {
    (0, axios_1.default)({
        url: task_config_1.JW_SERVER_API,
        method: 'post',
        data: {
            "data": {
                "noLogin": true,
                "getData": {
                    "module": "sql.observe",
                    "method": "runLog",
                    "params": {
                        "Fpage_url": Fpage_url,
                        "content": content,
                        "type": type,
                    }
                }
            }
        }
    });
};
//# sourceMappingURL=reportError.js.map