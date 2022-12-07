"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runner_screenshot_1 = require("../../monitor/runners/runner-screenshot");
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const task_config_1 = require("../../config/task-config");
const login_1 = require("../../monitor/login");
const utils_1 = require("../../utils");
const whistle_1 = __importDefault(require("../whistle"));
const mysql_1 = require("../../utils/mysql");
const alertServer_1 = require("../alertServer");
class SSIMRunner {
    constructor(taskConf, logger) {
        this.taskConf = taskConf;
        this.logger = logger;
    }
    async run() {
        this.logger.debug('SSIM Runner start');
        const { taskConf } = this;
        const { page, type, env, from } = taskConf.ctx;
        const { proxyID, proxyContent, account, url, page_id } = page;
        const options = {
            executablePath: task_config_1.CHROME_PATH,
            args: [...task_config_1.CHROME_FLAGS]
        };
        let proxyPort = null;
        if (proxyContent) {
            const w2 = await new whistle_1.default().start();
            w2.setRules(`# proxyID: ${proxyID}\n${proxyContent}` || '# no proxy content');
            proxyPort = w2.options.port;
            options.args.push((0, utils_1.getProxyFlagStr)(w2.options.port));
        }
        this.browser = await puppeteer_core_1.default.launch(options);
        this.logger.debug('ssim account uin', account);
        const isLogin = await (0, login_1.login)(this.browser, { url: url });
        if (!isLogin)
            throw new Error('no login');
        const proxyConf = proxyPort && { port: proxyPort, ip: '127.0.0.1' };
        const response = await (0, runner_screenshot_1.screen)(page, this.browser, '', proxyID, env, proxyConf);
        this.logger.trace(`ssim result`, response);
        await (0, mysql_1.saveTaskRes)({ taskId: this.taskConf.id, taskType: type, result: response, pageId: page_id, env: env, from });
        (0, alertServer_1.alertServer)(task_config_1.ALERT_ID_SSIM_CHANGE_NORMAL, { taskConf, taskResult: response }, page_id, env);
        (0, alertServer_1.alertServer)(task_config_1.ALERT_ID_ASSESTS_ERROR, { taskConf, taskResult: response }, page_id, env);
        return response;
    }
    async clear() {
        this.logger.debug('SSIM Runner Clear');
        if (!this.browser)
            return this.logger.debug('Browser is null skip clear');
        try {
            await this.browser.close();
            this.logger.trace('clear done');
        }
        catch (e) {
            this.logger.error(`LH Runner Clear Error ${e === null || e === void 0 ? void 0 : e.message}`);
        }
    }
}
exports.default = SSIMRunner;
//# sourceMappingURL=ssim.js.map