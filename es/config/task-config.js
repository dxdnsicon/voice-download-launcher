"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPath = exports.CHROME_FLAGS = exports.ALERT_ID_ASSESTS_ERROR = exports.ALERT_ID_SSIM_CHANGE_NORMAL = exports.ALERT_ID_LHR_UPDATE = exports.ALERT_ID_INTERNAL = exports.MAX_TASK_COUNT = exports.CLEAR_DURATION = exports.LOGIN_REFRESH_TIM = exports.SSIM_THRESHOLD_DEFAULT = exports.MD5_COMMAND = exports.maxdyncParamsLength = exports.LOGIN_TIMEOUT = exports.LOGIN_PWD = exports.LOGIN_UIN = exports.ADMIN_NAME = exports.PROXY_STR = exports.USE_PROXY = exports.PROXY_PORT = exports.PROXY_IP = exports.YQQ_IP = exports.N2_IP = exports.JW_SERVER_API = exports.JINGWEI_DOMAIN = exports.MASTER_LAUNCHER_DOMAIN = exports.LOG_LEVEL = exports.CHROME_PATH = exports.WHISTLE_PATH = exports.NET_RECORD_PATH = exports.LOGIN_PATH = exports.ALERT_TEMP_PATH = exports.TASK_HISTORY_PATH = exports.CACHE_DIR = exports.LOG_PATH = exports.baseDir = exports.DEBUG = exports.IS_MACOS = exports.MTKE_IMAGE_TAG = exports.MTKE_POD_IP = exports.CHROME_ENV = void 0;
require("dotenv/config");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const os_1 = require("os");
exports.CHROME_ENV = process.env.CHROME_ENV;
exports.MTKE_POD_IP = process.env.MTKE_POD_IP || 'localhost';
exports.MTKE_IMAGE_TAG = process.env.MTKE_IMAGE_TAG;
exports.IS_MACOS = (0, os_1.platform)() === 'darwin';
exports.DEBUG = process.env.DEBUG;
console.log('DEBUG', exports.DEBUG);
exports.baseDir = process.env.BASE_DIR || (0, path_1.join)(process.cwd(), "dist");
const dataDir = (0, path_1.join)(exports.baseDir, "/cache/");
exports.LOG_PATH = (0, path_1.join)(exports.baseDir, "logs");
exports.CACHE_DIR = dataDir;
exports.TASK_HISTORY_PATH = (0, path_1.join)(dataDir, "/lhcache.json");
exports.ALERT_TEMP_PATH = (0, path_1.join)(dataDir, "/alertMsg.json");
exports.LOGIN_PATH = (0, path_1.join)(dataDir, "/login");
exports.NET_RECORD_PATH = (0, path_1.join)(exports.baseDir, "/cache/");
exports.WHISTLE_PATH = (0, path_1.join)(exports.baseDir, 'whistle');
exports.CHROME_PATH = process.env.CHROME_PATH;
exports.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
exports.MASTER_LAUNCHER_DOMAIN = process.env.MASTER_LAUNCHER_DOMAIN;
exports.JINGWEI_DOMAIN = process.env.JINGWEI_DOMAIN;
exports.JW_SERVER_API = `http://${process.env.JINGWEI_DOMAIN}${process.env.JINGWEI_API_PATH}`;
exports.N2_IP = process.env.N2_IP;
exports.YQQ_IP = process.env.YQQ_IP;
exports.PROXY_IP = process.env.PROXY_IP;
exports.PROXY_PORT = process.env.PROXY_PORT;
exports.USE_PROXY = exports.PROXY_IP && exports.PROXY_PORT;
exports.PROXY_STR = exports.PROXY_IP ? `${exports.PROXY_IP}:${exports.PROXY_PORT || 80}` : '';
exports.ADMIN_NAME = "shiningding;alvabillwu;jacobren;kevinylzhao";
exports.LOGIN_UIN = process.env.LOGIN_UIN;
exports.LOGIN_PWD = process.env.LOGIN_PWD;
exports.LOGIN_TIMEOUT = process.env.LOGIN_TIMEOUT || 3000;
exports.maxdyncParamsLength = 5;
exports.MD5_COMMAND = exports.IS_MACOS ? process.env.MD5_COMMAND_MACOS : process.env.MD5_COMMAND;
exports.SSIM_THRESHOLD_DEFAULT = 0.6;
exports.LOGIN_REFRESH_TIM = 10800000;
exports.CLEAR_DURATION = 8640000000;
exports.MAX_TASK_COUNT = Number(process.env.MAX_TASK_COUNT || 1);
exports.ALERT_ID_INTERNAL = Number(process.env.ALERT_ID_INTERNAL);
exports.ALERT_ID_LHR_UPDATE = Number(process.env.ALERT_ID_LHR_UPDATE);
exports.ALERT_ID_SSIM_CHANGE_NORMAL = Number(process.env.ALERT_ID_SSIM_CHANGE_NORMAL);
exports.ALERT_ID_ASSESTS_ERROR = Number(process.env.ALERT_ID_ASSESTS_ERROR);
exports.CHROME_FLAGS = [
    ...(exports.IS_MACOS ? [] : ["--headless"]),
    "--no-sandbox",
    "--disable-gpu",
    '--disable-dev-shm-usage',
    '--ignoreHTTPSErrors=true',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--disable-infobars',
    '--no-first-run',
    '--disable-setuid-sandbox',
    '--ignore-certificate-errors',
];
const config = {
    runners: [
        "runner-lhreport",
        "runner-screenshot",
    ],
    actions: []
};
const initPath = (path) => {
    fs_1.default.exists(path, async (exists) => {
        if (!exists) {
            fs_1.default.mkdirSync(path);
        }
    });
};
exports.initPath = initPath;
(0, exports.initPath)(exports.baseDir);
(0, exports.initPath)((0, path_1.join)(exports.baseDir, "/checklib/"));
(0, exports.initPath)(dataDir);
(0, exports.initPath)(exports.LOG_PATH);
exports.default = config;
//# sourceMappingURL=task-config.js.map