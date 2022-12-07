"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const noticeCustom_1 = __importDefault(require("../utils/noticeCustom"));
const log_1 = __importDefault(require("../utils/log"));
const alertTemporary_1 = require("../utils/alertTemporary");
const task_config_1 = require("../config/task-config");
class Monitor {
    static start() {
        this.taskMonitor();
        this.alertCheck();
    }
    static alertCheck() {
        (0, log_1.default)('alert check.....');
    }
    static taskMonitor() {
        (0, log_1.default)('protect start.....');
        const { mtimeMs } = fs_1.default.statSync(task_config_1.TASK_HISTORY_PATH);
        const now = new Date().valueOf();
        if (now - mtimeMs > 10 * 60 * 1000) {
            const alertArr = (0, alertTemporary_1.readAlertTemporary)();
            if (alertArr && alertArr.length) {
                alertArr.forEach(item => {
                    const msg = `${item.msg}
          时间:${item.time}`;
                    (0, log_1.default)(msg);
                    (0, noticeCustom_1.default)(msg, null, {
                        key: 'runtimeerror',
                        duration: 60 * 60 * 1000 * 2
                    });
                });
            }
            else {
                const msg = `【精卫平台监控脚本异常】 
检测到上一次任务结束时间为:${new Date(mtimeMs)}
请查看脚本是否异常`;
                (0, log_1.default)(msg);
                (0, noticeCustom_1.default)(msg, null, {
                    key: 'runtimeerror',
                    duration: 60 * 60 * 1000 * 2
                });
            }
            (0, alertTemporary_1.deleteAlertTemporary)();
        }
        (0, log_1.default)('protect end.....');
    }
}
exports.default = Monitor;
//# sourceMappingURL=index.js.map