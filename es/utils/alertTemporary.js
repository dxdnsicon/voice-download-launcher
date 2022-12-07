"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlertTemporary = exports.writeAlertTemporary = exports.readAlertTemporary = void 0;
const fs_1 = __importDefault(require("fs"));
const task_config_1 = require("../config/task-config");
const log_1 = __importDefault(require("../utils/log"));
const readAlertTemporary = () => {
    try {
        if (!fs_1.default.existsSync(task_config_1.ALERT_TEMP_PATH)) {
            return [];
        }
        return JSON.parse(fs_1.default.readFileSync(task_config_1.ALERT_TEMP_PATH, 'utf-8'));
    }
    catch (error) {
        (0, log_1.default)('read alert temporary file error', error);
        return [];
    }
};
exports.readAlertTemporary = readAlertTemporary;
const writeAlertTemporary = (msg) => {
    try {
        if (!fs_1.default.existsSync(task_config_1.CACHE_DIR)) {
            fs_1.default.mkdirSync(task_config_1.CACHE_DIR);
        }
        let oldData = [];
        if (fs_1.default.existsSync(task_config_1.ALERT_TEMP_PATH)) {
            oldData = JSON.parse(fs_1.default.readFileSync(task_config_1.ALERT_TEMP_PATH, 'utf-8'));
            console.log('oldData >>>>', oldData);
        }
        const alertMSg = {
            time: new Date(),
            msg: msg
        };
        oldData.push(alertMSg);
        fs_1.default.writeFileSync(task_config_1.ALERT_TEMP_PATH, JSON.stringify(oldData));
    }
    catch (error) {
        (0, log_1.default)('write alert temporary file error', error);
    }
};
exports.writeAlertTemporary = writeAlertTemporary;
const deleteAlertTemporary = () => {
    try {
        if (fs_1.default.existsSync(task_config_1.CACHE_DIR)) {
            fs_1.default.unlinkSync(task_config_1.ALERT_TEMP_PATH);
        }
    }
    catch (error) {
        (0, log_1.default)('delete alert temporary file error', error);
    }
};
exports.deleteAlertTemporary = deleteAlertTemporary;
//# sourceMappingURL=alertTemporary.js.map