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
const qmfe_lighthouse_1 = __importDefault(require("@tencent/qmfe-lighthouse"));
const desktop_config_1 = __importDefault(require("../../config/desktop-config"));
const mobile_config_1 = __importDefault(require("../../config/mobile-config"));
const login_1 = require("../../monitor/login");
const auditInstaller_1 = require("../../utils/auditInstaller");
const reportLhResult_1 = __importStar(require("../../utils/reportLhResult"));
const utils_1 = require("../../utils");
const time_1 = __importDefault(require("../../utils/time"));
const mysql_1 = require("../../utils/mysql");
const chromeLauncher = __importStar(require("chrome-launcher/dist/chrome-launcher"));
const task_config_1 = require("../../config/task-config");
const whistle_1 = __importDefault(require("../whistle"));
const alertServer_1 = require("../alertServer");
class LighthouseRunner {
    constructor(taskConf, logger) {
        this.taskConf = taskConf;
        this.logger = logger;
    }
    async run() {
        const { taskConf } = this;
        const { page, from, env, type } = taskConf.ctx;
        const { url, proxyID, proxyContent, page_id } = page;
        const chromeOptions = {
            chromeFlags: task_config_1.CHROME_FLAGS,
            chromePath: task_config_1.CHROME_PATH
        };
        let proxyPort = null;
        if (proxyContent) {
            const w2 = await new whistle_1.default().start();
            proxyPort = w2.options.port;
            w2.setRules(`# proxyID: ${proxyID}\n${proxyContent}`);
            chromeOptions.chromeFlags.push((0, utils_1.getProxyFlagStr)(proxyPort));
            this.logger.debug(`Whistle 代理启动成功 Port: ${proxyPort}`);
        }
        const proxyConf = proxyPort && { port: proxyPort, ip: '127.0.0.1' };
        const { changeWithAll, savedMD5, currentMD5, urlMd5 } = await (0, utils_1.checkPageMd5Change)(page, proxyID, proxyConf);
        this.logger.debug(`checkPageMd5Change env: ${env} proxyID: ${proxyID} proxyConf: ${proxyConf} savedMD5: ${savedMD5} curMD5: ${currentMD5}`);
        if (from === "SCHEDULE" && !changeWithAll)
            return null;
        this.chrome = await chromeLauncher.launch(chromeOptions);
        try {
            const isLogin = await (0, login_1.loginFromChromeLauncherMethod)({ port: this.chrome.port, url: url });
            if (!isLogin)
                throw new Error('no login');
            const { lhr } = await this.lighthouse(this.chrome.port);
            const urlDateMd5 = urlMd5 + (0, time_1.default)(new Date(), 'yyyyMMddhhmmss');
            const reponse = await (0, reportLhResult_1.default)(lhr, urlDateMd5, page, env, from);
            await (0, mysql_1.upsertUrlContentMd5)(url, proxyID, currentMD5, savedMD5);
            await (0, mysql_1.saveReport)({ record: lhr, md5: urlDateMd5 });
            await (0, mysql_1.saveTaskRes)({ taskId: this.taskConf.id, taskType: type, result: reponse, pageId: page_id, env: env, from });
            const auditResult = {
                pass: (0, reportLhResult_1.computeAuditNum)(lhr, 'pass'),
                warning: (0, reportLhResult_1.computeAuditNum)(lhr, 'warning'),
                error: (0, reportLhResult_1.computeAuditNum)(lhr, 'error'),
                performance: (0, reportLhResult_1.getMetricsDetail)(lhr)
            };
            const taskResult = { md5: urlDateMd5, auditResult };
            (0, alertServer_1.alertServer)(task_config_1.ALERT_ID_LHR_UPDATE, { taskConf, taskResult }, page_id, env);
            return reponse;
        }
        catch (e) {
            this.logger.error(`Runner error ${e === null || e === void 0 ? void 0 : e.message}`);
            throw e;
        }
    }
    async lighthouse(port) {
        const { taskConf } = this;
        const { page } = taskConf.ctx;
        const { url, isPc, audits } = page;
        await (0, auditInstaller_1.auditInstaller)(audits);
        const config = (isPc ? (0, desktop_config_1.default)({ audits }) : (0, mobile_config_1.default)({ audits }));
        const options = {
            logLevel: 'debug',
            output: "html",
            onlyCategories: [
                "performance",
                "pwa",
                "seo",
                "best-practices",
                "accessibility",
            ],
            port,
            locale: "zh",
        };
        return await (0, qmfe_lighthouse_1.default)(decodeURIComponent(url), options, config);
    }
    async clear() {
        this.logger.debug('LH Runner Clear');
        if (!this.chrome)
            return this.logger.debug(`Chrome is null skip clear`);
        try {
            await this.chrome.kill();
            this.logger.trace('clear done');
        }
        catch (e) {
            this.logger.error(`LH Runner Clear Error ${e === null || e === void 0 ? void 0 : e.message}`);
        }
    }
}
exports.default = LighthouseRunner;
//# sourceMappingURL=lighthouse.js.map