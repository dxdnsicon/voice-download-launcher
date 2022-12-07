"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_config_1 = require("../config/task-config");
const log4js_1 = __importDefault(require("log4js"));
if (!task_config_1.IS_MACOS) {
    log4js_1.default.configure({
        appenders: {
            out: { type: "stdout" },
            errorFile: { type: "dateFile", filename: "/data/log/err.log", pattern: 'yyyy-MM-dd', compress: false, numBackups: 3 },
            warnFile: { type: "dateFile", filename: "/data/log/warn.log", pattern: 'yyyy-MM-dd', compress: false, numBackups: 3 },
            infoFile: { type: "dateFile", filename: "/data/log/info.log", pattern: 'yyyy-MM-dd', compress: false, numBackups: 2 },
            debugFile: { type: "dateFile", filename: "/data/log/debug.log", pattern: 'yyyy-MM-dd', compress: true, numBackups: 1 },
            traceFile: { type: "dateFile", filename: "/data/log/trace.log", pattern: 'yyyy-MM-dd', compress: true, numBackups: 1 },
            error: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' },
            warn: { type: 'logLevelFilter', appender: 'warnFile', level: 'warn' },
            info: { type: 'logLevelFilter', appender: 'infoFile', level: 'info' },
            debug: { type: 'logLevelFilter', appender: 'debugFile', level: 'debug' },
            trace: { type: 'logLevelFilter', appender: 'traceFile', level: 'trace' }
        },
        categories: {
            default: { appenders: ["out", 'trace', 'debug', 'info', 'warn', 'error'], level: task_config_1.LOG_LEVEL }
        }
    });
}
const logger = log4js_1.default.getLogger('app');
logger.info('Init Logger Success Log Level', task_config_1.LOG_LEVEL);
process.on('unhandledRejection', (reason) => {
    logger.error("UnhandledRejection", reason === null || reason === void 0 ? void 0 : reason.message, reason === null || reason === void 0 ? void 0 : reason.stack);
    const alertServer = require('./alertServer');
    alertServer(task_config_1.ALERT_ID_INTERNAL, `Launcher IP:${task_config_1.MTKE_POD_IP}\nVersion:${task_config_1.MTKE_IMAGE_TAG}\n出现未捕获的错误 unhandledRejection:\n${reason === null || reason === void 0 ? void 0 : reason.message} \n${reason === null || reason === void 0 ? void 0 : reason.stack}`);
});
process.on('uncaughtException', (reason) => {
    logger.error("UnhandledRejection", reason === null || reason === void 0 ? void 0 : reason.message, reason === null || reason === void 0 ? void 0 : reason.stack);
    const alertServer = require('./alertServer');
    alertServer(task_config_1.ALERT_ID_INTERNAL, `Launcher IP:${task_config_1.MTKE_POD_IP}\nVersion:${task_config_1.MTKE_IMAGE_TAG}\n出现未捕获的错误 uncaughtException:\n${reason === null || reason === void 0 ? void 0 : reason.message} \n${reason === null || reason === void 0 ? void 0 : reason.stack}`);
});
exports.default = task_config_1.IS_MACOS ? console : logger;
//# sourceMappingURL=logger.js.map