"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("./axios"));
const task_config_1 = require("../config/task-config");
exports.default = (opt) => {
    (0, axios_1.default)({
        url: task_config_1.JW_SERVER_API,
        method: 'post',
        data: {
            "data": {
                "noLogin": true,
                "getData": {
                    "module": "sql.observe",
                    "method": "ssimLog",
                    "params": {
                        "followers": opt.followers,
                        "ssimThreshold": opt.ssimThreshold,
                        "page_name": opt.page_name,
                        "prevDiffName": opt.prevDiffName,
                        "nextDiffName": opt.nextDiffName,
                        "status": opt.status,
                        "ssim": opt.ssim,
                        "mcs": opt.mcs,
                        "isPc": opt.isPc,
                        "page_id": opt.page_id,
                        "page_url": opt.page_url,
                        "env": opt.env
                    }
                }
            }
        }
    });
};
//# sourceMappingURL=reportSsim.js.map