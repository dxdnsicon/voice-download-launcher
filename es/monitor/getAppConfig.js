"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTask = void 0;
const axios_1 = __importDefault(require("../utils/axios"));
const task_config_1 = require("../config/task-config");
const logger_1 = __importDefault(require("../launcher/logger"));
const errMsg = `【精卫平台监控应用配置下发异常】 
检测到精卫平台下发配置为空，请检查`;
const formatTask = taskRaw => {
    const page = taskRaw.ctx.page;
    taskRaw.ctx.page = Object.assign(Object.assign({}, page), { page_id: page.pageId, title: page.pageName, url: page.pageUrl, toPerson: page.followers ? page.followers.join(';') : '', ssimThreshold: page.ssimThreshold || 0.5, account: page.account, isPc: page.pageType === 1, paramFlag: page.paramFlag, dyncparamsList: page.dyncparamsList, paramKey: page.paramKey, audits: page.audits || [], uitest: page.uitest, proxyList: page.proxyList || [] });
    return taskRaw;
};
exports.formatTask = formatTask;
const getTask = async (ip, count) => {
    logger_1.default.debug(`Fn getTask`, ip, count);
    return (0, axios_1.default)({
        url: `http://${task_config_1.MASTER_LAUNCHER_DOMAIN}/api/v1/queue/claim`,
        method: 'get',
        params: { ip, count }
    })
        .then((rs) => {
        const taskList = rs
            .filter(x => { var _a, _b; return !((_b = (_a = x === null || x === void 0 ? void 0 : x.ctx) === null || _a === void 0 ? void 0 : _a.page) === null || _b === void 0 ? void 0 : _b.pageStatus); })
            .map(exports.formatTask);
        logger_1.default.info(`Claim ${taskList.length} Task`);
        logger_1.default.debug(`Claim Task ${taskList.map(x => x.id)}`);
        return taskList;
    });
};
exports.default = getTask;
//# sourceMappingURL=getAppConfig.js.map