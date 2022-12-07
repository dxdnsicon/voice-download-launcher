"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("./axios"));
const task_config_1 = require("../config/task-config");
const index_1 = require("./index");
exports.default = (content, pageid, opts) => {
    let keyContent = content.replace(/\?([^\n]+)/g, '');
    const key = `${opts === null || opts === void 0 ? void 0 : opts.key}_${(0, index_1.createMd5)(keyContent)}`;
    if (!content) {
        return;
    }
    (0, axios_1.default)({
        url: task_config_1.JW_SERVER_API,
        method: 'post',
        data: {
            "data": {
                "noLogin": true,
                "getData": {
                    "module": "sql.observe",
                    "method": "customData",
                    "params": {
                        "rtx": task_config_1.ADMIN_NAME,
                        "Fpage_id": pageid,
                        "key": key || 'custom',
                        "duration": (opts === null || opts === void 0 ? void 0 : opts.duration) || 30 * 60 * 1000,
                        "content": content,
                        "env": (opts === null || opts === void 0 ? void 0 : opts.env) || ''
                    }
                }
            }
        }
    });
};
//# sourceMappingURL=noticeCustom.js.map