"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleScreenShotNotice = exports.handleLhNotice = exports.noticeHandle = void 0;
const action_1 = __importDefault(require("./action"));
const errorCode_1 = require("../../typings/errorCode");
const global_1 = require("../../typings/global");
const log_1 = __importDefault(require("../../utils/log"));
const noticeCustom_1 = __importDefault(require("../../utils/noticeCustom"));
const msg_1 = require("../../config/msg");
const noticeHandle = (notice, env) => {
    if (notice && notice.length > 0) {
        try {
            (0, log_1.default)('runner notice:', JSON.stringify(notice));
            notice && notice.forEach((noticeItem) => {
                (0, noticeCustom_1.default)(noticeItem.content, noticeItem.Fpage_id, {
                    key: noticeItem.key,
                    duration: noticeItem.duration,
                    env: env
                });
            });
        }
        catch (e) {
            console.error(e);
        }
    }
};
exports.noticeHandle = noticeHandle;
const handleLhNotice = (pageItem, data, env) => {
    let notice = [];
    if ((data === null || data === void 0 ? void 0 : data.code) === errorCode_1.ErrorCode.CURL_SSR_ERROR) {
        notice.push({
            Fpage_id: pageItem.page_id,
            key: global_1.MessageType.SSRERROR,
            content: (0, msg_1.ssrErrorMsg)(pageItem, env),
            duration: global_1.MessageDuration.SSRERROR
        });
    }
    return notice;
};
exports.handleLhNotice = handleLhNotice;
const handleScreenShotNotice = (pageItem, data, env) => {
    let notice = [];
    const url = data.url || pageItem.url;
    if ((data === null || data === void 0 ? void 0 : data.errorFileList) && (data === null || data === void 0 ? void 0 : data.errorFileList.length) > 0) {
        notice.push({
            Fpage_id: pageItem.page_id,
            key: global_1.MessageType.ABNORMALRESOURCE,
            content: (0, msg_1.notFoundMsg)(pageItem, data.errorFileList, url, env),
            duration: global_1.MessageDuration.DEFAULT
        });
    }
    if ((data === null || data === void 0 ? void 0 : data.errorMessageList) && (data === null || data === void 0 ? void 0 : data.errorMessageList.length) > 0) {
        notice.push({
            Fpage_id: pageItem.page_id,
            key: global_1.MessageType.PAGEERROR,
            content: (0, msg_1.pageErrorMsg)(pageItem, data.errorMessageList, url, env),
            duration: global_1.MessageDuration.DEFAULT
        });
    }
    if ((data === null || data === void 0 ? void 0 : data.largeFileList) && (data === null || data === void 0 ? void 0 : data.largeFileList.length) > 0) {
        notice.push({
            Fpage_id: pageItem.page_id,
            key: global_1.MessageType.LARGERESOURCE,
            content: (0, msg_1.largeErrorMsg)(pageItem, data.largeFileList, url, env),
            duration: global_1.MessageDuration.DEFAULT
        });
    }
    if ((data === null || data === void 0 ? void 0 : data.childPageList) && (data === null || data === void 0 ? void 0 : data.childPageList.length) > 0) {
        data.childPageList.forEach(item => {
            notice = [...notice, ...(0, exports.handleScreenShotNotice)(pageItem, item, env)];
        });
    }
    return notice;
};
exports.handleScreenShotNotice = handleScreenShotNotice;
class ActionNotice extends action_1.default {
    async run(pageItem, runnerData, env) {
        console.log('runnerData', runnerData);
        const runnerList = Object.keys(runnerData);
        let noticeList = [];
        runnerList.forEach((item) => {
            const data = runnerData[item];
            switch (item) {
                case 'runner-lhreport':
                    noticeList.push(...noticeList, ...(0, exports.handleLhNotice)(pageItem, data, env));
                    break;
                case 'runner-screenshot':
                    noticeList = [...noticeList, ...(0, exports.handleScreenShotNotice)(pageItem, data, env)];
                    break;
            }
        });
        (0, exports.noticeHandle)(noticeList, env);
    }
}
exports.default = ActionNotice;
//# sourceMappingURL=action-notice.js.map