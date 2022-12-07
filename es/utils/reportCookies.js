"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPlatformAccount = exports.queryAccount = void 0;
const axios_1 = __importDefault(require("./axios"));
const AccountAPI = 'http://jingwei.tmeoa.com/backend/api/v1/getMultiple';
const AccountAPI_TEST = 'http://jwtest.woa.com/backend/api/v1/getMultiple';
const logger_1 = __importDefault(require("../launcher/logger"));
const queryAccount = async (uin, url) => {
    var _a, _b, _c, _d, _e;
    try {
        let response = null;
        if (url) {
            const data = await (0, axios_1.default)({
                url: AccountAPI,
                method: 'post',
                data: {
                    "data": {
                        "noLogin": true,
                        "getData": {
                            "module": "sql.uitest",
                            "method": "queryUinFromPageUrl",
                            "params": {
                                "url": url
                            }
                        }
                    }
                }
            });
            response = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.getData) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.Fcookies;
        }
        else {
            const data = await (0, axios_1.default)({
                url: AccountAPI,
                method: 'post',
                data: {
                    "data": {
                        "noLogin": true,
                        "getData": {
                            "module": "sql.uitest",
                            "method": "queryAccounutCookies",
                            "params": {
                                uin
                            }
                        }
                    }
                }
            });
            response = (_e = (_d = data === null || data === void 0 ? void 0 : data.data) === null || _d === void 0 ? void 0 : _d.getData) === null || _e === void 0 ? void 0 : _e.data;
        }
        return response;
    }
    catch (e) {
        return null;
    }
};
exports.queryAccount = queryAccount;
const queryPlatformAccount = async () => {
    var _a, _b;
    try {
        const data = await (0, axios_1.default)({
            url: AccountAPI,
            method: 'post',
            data: {
                "data": {
                    "noLogin": true,
                    "getData": {
                        "module": "sql.uitest",
                        "method": "queryAllAccount",
                        "params": {}
                    }
                }
            }
        });
        const response = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.getData) === null || _b === void 0 ? void 0 : _b.data;
        return response;
    }
    catch (e) {
        return null;
    }
};
exports.queryPlatformAccount = queryPlatformAccount;
exports.default = async (opt) => {
    const data = await (0, axios_1.default)({
        url: AccountAPI,
        method: 'post',
        data: {
            "data": {
                "noLogin": true,
                "getData": {
                    "module": "sql.uitest",
                    "method": "reportAccounutCookies",
                    "params": {
                        "uin": opt.uin,
                        "cookies": opt.cookies
                    }
                }
            }
        }
    });
    logger_1.default.info('reportCookies', data);
    const dataTest = await (0, axios_1.default)({
        url: AccountAPI_TEST,
        method: 'post',
        data: {
            "data": {
                "noLogin": true,
                "getData": {
                    "module": "sql.uitest",
                    "method": "reportAccounutCookies",
                    "params": {
                        "uin": opt.uin,
                        "cookies": opt.cookies
                    }
                }
            }
        }
    });
    logger_1.default.info('reportCookies test', dataTest);
};
//# sourceMappingURL=reportCookies.js.map