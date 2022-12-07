"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoTestCore = exports.excuteCase = exports.checkNavigatorHasChange = void 0;
const typings_1 = require("./typings");
const browser_1 = __importDefault(require("../monitor/browser"));
const login_1 = require("../monitor/login");
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const log_1 = __importDefault(require("../utils/log"));
const monitor_1 = __importDefault(require("../gather/monitor"));
const core_1 = __importDefault(require("./core"));
const utils_1 = require("../utils");
const aes_1 = require("../utils/aes");
const reportUitestProcess_1 = __importDefault(require("../utils/reportUitestProcess"));
const logger_1 = __importDefault(require("../launcher/logger"));
const checkNavigatorHasChange = async (page, pageItem, isReload) => {
    try {
        const { Fpage_url } = pageItem;
        const url = await page.evaluate(() => window.location.href);
        if (url && Fpage_url.indexOf(url.split('?')[0]) < 0) {
            await page.goto(Fpage_url, {
                waitUntil: 'networkidle0',
            });
            return;
        }
        return;
    }
    catch (e) {
        return;
    }
};
exports.checkNavigatorHasChange = checkNavigatorHasChange;
const excuteQueue = async ({ page, eventList, caseItem, pageDetails }, response, index = 0) => {
    try {
        const { Fcase_id, Fcase_history_id } = caseItem;
        const { proxyContent, proxyId, master_taskid, user, env, from } = pageDetails;
        logger_1.default.info(`${master_taskid} start excute case:  ${index}`);
        const { pageItem } = pageDetails.uitest;
        const eventItem = eventList[index];
        const excuteResponse = await (0, core_1.default)(page, {
            eventItem,
            Fcase_id,
            Fcase_history_id,
            index,
            pageItem,
            master_taskid,
        });
        logger_1.default.info(`${master_taskid} reponse excute case:  ${index}`, excuteResponse);
        (0, reportUitestProcess_1.default)({
            master_taskid,
            from,
            Fcase_history_id: pageItem.isPreview ? '-1' : Fcase_history_id,
            eventIndex: pageItem.isPreview ? -1 : index,
            resultType: excuteResponse.resultType,
            resultMsg: excuteResponse.resultMsg,
            result: excuteResponse.result,
            expectation: excuteResponse.expectation,
            error: (excuteResponse === null || excuteResponse === void 0 ? void 0 : excuteResponse.error) || '',
            env: {
                env,
                pageItem,
                user,
                proxyId,
                proxyContent,
            }
        });
        response.push(excuteResponse);
    }
    catch (e) {
        response.push(e);
        console.error('excuteQueue err:', e);
    }
    if (eventList[index + 1]) {
        await (0, utils_1.sleep)(1000);
        return excuteQueue({
            page, eventList, caseItem, pageDetails
        }, response, index + 1);
    }
    else {
        return response;
    }
};
const excuteCase = async (browser, caseItem, pageDetails, proxyPort, pageMap) => {
    try {
        let responseCount = 0;
        let errorFileList = [];
        let errorMessageList = [];
        let largeFileList = [];
        const { Fcase_id, eventList, account } = caseItem;
        const { pageItem } = pageDetails.uitest;
        if (!pageItem.Fpage_url) {
            throw `${Fcase_id}: no Fpage_url found`;
        }
        let page;
        let loginInfo = null;
        if (account === null || account === void 0 ? void 0 : account.uin) {
            loginInfo = await (0, login_1.login)(browser, {
                uin: account.uin,
                pwd: account.password ? (0, aes_1.deaes128cbc)(account.password, account.Fvi) : ''
            });
            if (!loginInfo) {
                throw '登录失败或登录超时 code:1000';
            }
        }
        else {
            loginInfo = null;
            await (0, login_1.removeLoginState)(browser);
        }
        if (pageMap === null || pageMap === void 0 ? void 0 : pageMap[pageItem.Fpage_url]) {
            page = pageMap === null || pageMap === void 0 ? void 0 : pageMap[pageItem.Fpage_url];
        }
        else {
            page = await browser.newPage();
            if (!pageItem.isPc) {
                await page.emulate(puppeteer_core_1.default.devices['iPhone X']);
            }
            (0, log_1.default)('uitest init----');
            await page.setDefaultTimeout(30000);
            (0, monitor_1.default)(page, errorFileList, largeFileList, errorMessageList);
            if (pageMap) {
                pageMap[pageItem.Fpage_url] = page;
            }
            await page.goto(pageItem.Fpage_url, {
                waitUntil: 'networkidle0',
            });
            console.log('errorFileList', errorFileList);
            console.log('largeFileList', largeFileList);
        }
        logger_1.default.info('checkNavigatorHasChange start:');
        await (0, exports.checkNavigatorHasChange)(page, pageItem, false);
        let response = [];
        await excuteQueue({
            page, eventList, caseItem, pageDetails
        }, response);
        return response;
    }
    catch (e) {
        throw e;
    }
};
exports.excuteCase = excuteCase;
const excuteCaseForQQMusic = async (caseItem, pageDetails, proxyPort) => {
    const { Fcase_id, Fcase_history_id, eventList, account } = caseItem;
    const { pageItem } = pageDetails.uitest;
    return [
        {
            Fcase_id,
            Fcase_history_id,
            resultIndex: 0,
            resultType: typings_1.FcaseExcuteStatus.DOING,
            resultMsg: '',
            result: {},
            expectation: {},
            error: ''
        }
    ];
};
const exuteCaseQueue = async ({ browser, pageDetails, index, proxyPort, pageMap, response, maxIndex }) => {
    var _a;
    const { uitest, env, master_taskid, from } = pageDetails;
    const { pageItem } = pageDetails.uitest;
    try {
        const eventItem = uitest.caseList[index];
        const { env } = eventItem;
        let excuteResponse = null;
        if (env === 'H5' || !!pageItem.isPreview) {
            excuteResponse = await (0, exports.excuteCase)(browser, eventItem, pageDetails, proxyPort, pageMap);
        }
        else if (env === 'QQMusic') {
            excuteResponse = await excuteCaseForQQMusic(eventItem, pageDetails, proxyPort);
            console.log('QQMusic Task commit');
        }
        response[index] = excuteResponse;
    }
    catch (e) {
        logger_1.default.error('autoTestCore', e);
        const { Fcase_history_id } = ((_a = uitest.caseList) === null || _a === void 0 ? void 0 : _a[index]) || { Fcase_history_id: '-1' };
        const { proxyContent, proxyId, user } = pageDetails;
        (0, reportUitestProcess_1.default)({
            from,
            master_taskid,
            Fcase_history_id,
            eventIndex: -1,
            resultType: typings_1.FcaseExcuteStatus.ABNORMAL,
            resultMsg: (e === null || e === void 0 ? void 0 : e.toString()) || e,
            result: e,
            expectation: '',
            env: {
                env,
                pageItem,
                user,
                proxyId,
                proxyContent,
                isPreview: !!pageItem.isPreview
            }
        });
        response[index] = [];
    }
    if (uitest.caseList[index + 1] && index + 1 <= maxIndex) {
        await (0, utils_1.sleep)(1000);
        return exuteCaseQueue({ browser, pageDetails, index: index + 1, proxyPort, pageMap, response, maxIndex });
    }
    else {
        return response;
    }
};
const autoTestCore = (pageDetails, index, size, proxyPort) => {
    return new Promise(async (resolve) => {
        const response = {};
        logger_1.default.info('child autoTestCore', index, size);
        if (!pageDetails) {
            return process.exit(0);
        }
        const { uitest } = pageDetails;
        const browser = await browser_1.default.initBrowser(proxyPort ? [proxyPort] : []);
        const pageMap = {};
        const res = await exuteCaseQueue({ browser, pageDetails, index: index * size, maxIndex: (index + 1) * size, proxyPort, pageMap, response });
        browser === null || browser === void 0 ? void 0 : browser.close();
        resolve(res);
    });
};
exports.autoTestCore = autoTestCore;
//# sourceMappingURL=excute.js.map