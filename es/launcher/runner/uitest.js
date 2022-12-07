"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uitest_1 = __importDefault(require("../../uitest"));
const whistle_1 = __importDefault(require("../whistle"));
const utils_1 = require("../../utils");
const mysql_1 = require("../../utils/mysql");
class SSIMRunner {
    constructor(taskConf, logger) {
        this.taskConf = taskConf;
        this.logger = logger;
    }
    async run() {
        this.logger.debug('uitest Runner start');
        const { taskConf } = this;
        const { page, from, type, user, env } = taskConf.ctx;
        const { proxyContent, Fpage_id } = page;
        page.master_taskid = taskConf.id;
        page.user = user;
        page.env = env;
        page.from = from;
        this.logger.debug(`uitest Runner start ${page.master_taskid}, ${page.user}`);
        let proxyPort = null;
        if (proxyContent) {
            const w2 = await new whistle_1.default().start();
            w2.setRules(proxyContent || '# no proxy content');
            proxyPort = (0, utils_1.getProxyFlagStr)(w2.options.port);
        }
        const response = await (0, uitest_1.default)(page, proxyPort);
        await (0, mysql_1.saveTaskRes)({ taskId: this.taskConf.id, taskType: type, result: response, pageId: Fpage_id, env: env, from });
        return response;
    }
    async clear() {
        this.logger.debug('UItest Runner Clear');
        if (!this.browser)
            return this.logger.debug('Browser is null skip clear');
        try {
            await this.browser.close();
            this.logger.trace('clear done');
        }
        catch (e) {
            this.logger.error(`UItest Runner Clear Error ${e === null || e === void 0 ? void 0 : e.message}`);
        }
    }
}
exports.default = SSIMRunner;
//# sourceMappingURL=uitest.js.map