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
const chromeLauncher = __importStar(require("chrome-launcher"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const qmfe_lighthouse_1 = __importDefault(require("@tencent/qmfe-lighthouse"));
const mobile_config_1 = __importDefault(require("../config/mobile-config"));
const desktop_config_1 = __importDefault(require("../config/desktop-config"));
const reportError_1 = __importDefault(require("../utils/reportError"));
const log_1 = __importDefault(require("../utils/log"));
const time_1 = __importDefault(require("../utils/time"));
const login_1 = require("../monitor/login");
const index_1 = require("../utils/index");
const reportLhResult_1 = __importDefault(require("../utils/reportLhResult"));
const task_config_1 = require("../config/task-config");
const auditInstaller_1 = require("../utils/auditInstaller");
const mysql_1 = require("../utils/mysql");
let retry = 3;
const generateReport = async (opt, config = null) => {
    const { url, isPc, flags = [], cb = null, audits = [] } = opt;
    config =
        config || (isPc ? (0, desktop_config_1.default)({ audits }) : (0, mobile_config_1.default)({ audits }));
    (0, log_1.default)("lighthouse start");
    (0, log_1.default)("link: ", url);
    (0, log_1.default)("isPc: ", isPc);
    (0, log_1.default)("audits: ", audits);
    await (0, auditInstaller_1.auditInstaller)(audits);
    console.log('chromeFlags: ', [...task_config_1.CHROME_FLAGS, ...flags]);
    const chrome = await chromeLauncher.launch({
        chromeFlags: [...task_config_1.CHROME_FLAGS, ...flags],
        chromePath: task_config_1.CHROME_PATH
    });
    console.log('chrome prot: ', chrome.port);
    try {
        const options = {
            logLevel: 'info',
            output: "html",
            onlyCategories: [
                "performance",
                "pwa",
                "seo",
                "best-practices",
                "accessibility",
            ],
            port: chrome.port,
            locale: "zh",
        };
        const isLogin = await (0, login_1.loginFromChromeLauncher)(options);
        if (!isLogin)
            throw new Error('no login');
        const runnerResult = await (0, qmfe_lighthouse_1.default)(decodeURIComponent(url), options, config);
        await chrome.kill();
        (0, log_1.default)("lighthouse over");
        try {
            const md5 = (0, index_1.createMd5)(url);
            const md5Name = md5 + (0, time_1.default)(new Date(), 'yyyyMMddhhmmss');
            const lhr = runnerResult.lhr;
            if (lhr.categories.performance.score > 0) {
                (0, log_1.default)("Performance score was", runnerResult.lhr.categories.performance.score * 100);
                fs_1.default.writeFileSync((0, path_1.join)(task_config_1.NET_RECORD_PATH, `/${md5}_network.json`), JSON.stringify(lhr.networkRecords));
                await (0, reportLhResult_1.default)(lhr, md5Name, opt, '', 'old');
                delete lhr.networkRecords;
            }
            else {
                delete lhr.networkRecords;
                (0, log_1.default)("Performance score error: ", url);
                (0, log_1.default)("Performance score error: ", lhr.categories.performance.score);
                (0, log_1.default)("retry");
                retry--;
                (0, log_1.default)("retry times", retry);
                if (retry >= 0) {
                    if (!opt.isPc && index_1.checkIsPc) {
                        opt.isPc = true;
                        config = desktop_config_1.default;
                    }
                    return generateReport(opt, config);
                }
                else {
                    (0, log_1.default)("retry error", url);
                    (0, reportError_1.default)(url, "lighthouse retry 3 times error", "2");
                    return {
                        finalUrl: "",
                        isPc,
                        md5: null,
                        errorUrl: url,
                    };
                }
            }
            await (0, mysql_1.saveReport)({ record: lhr, md5: md5Name });
            return {
                finalUrl: `https://${task_config_1.MASTER_LAUNCHER_DOMAIN}/viewer/index.html?m=${md5Name}`,
                md5: md5Name,
            };
        }
        catch (e) {
            (0, log_1.default)("error:" + e);
            return await chrome.kill();
        }
    }
    catch (e) {
        (0, log_1.default)("error:" + e);
        return await chrome.kill();
    }
};
const core = async (opt) => {
    const { url } = opt;
    (0, log_1.default)("Generating Lighthouse report...");
    if (!url) {
        (0, log_1.default)(chalk_1.default.red("An error: no url params"));
        return;
    }
    try {
        return await generateReport(opt);
    }
    catch (e) {
        (0, log_1.default)(chalk_1.default.red("An error!", e));
        return null;
    }
};
exports.default = core;
//# sourceMappingURL=core.js.map