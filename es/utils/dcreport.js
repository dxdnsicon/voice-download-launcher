"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.report = exports.setReportTime = void 0;
const packageConfig = require('../../package.json');
const axios_1 = __importDefault(require("./axios"));
const time_1 = __importDefault(require("./time"));
const logger_1 = __importDefault(require("../launcher/logger"));
let reportTime = '';
const reportSend = (key, data) => {
    try {
        data = Object.assign(Object.assign({}, data), { _key: key, _opertime: ((Date.now() / 1000) | 0).toString() });
        const json = {
            common: {
                _account_source: "1",
                _app: "other",
                _app_version: "",
                _appid: "qqmusic",
                _channelid: "",
                _network_type: "unknown",
                _opertime: data._opertime,
                _os: "",
                _os_version: "",
                _platform: 0,
                _uid: 0
            },
            items: [data],
        };
        logger_1.default.info('ssim report data:==>', JSON.stringify(json));
        const reportdata = (0, axios_1.default)({
            url: 'http://stat.y.qq.com/sdk/fcgi-bin/sdk.fcg',
            method: 'post',
            data: json
        });
        logger_1.default.info('ssim report data:==>', JSON.stringify(reportdata));
    }
    catch (e) {
        logger_1.default.info('ssim report error:==>', e);
    }
};
const setReportTime = () => {
    reportTime = (0, time_1.default)(new Date(), 'yyyy-MM-dd mm:hh');
};
exports.setReportTime = setReportTime;
const report = ({ api, ext_str1 = '', ext_str2 = '', ext_str3 = '', ext_str4 = '', ext_str5 = '', base_url = '', ext_int1 = 9999, ext_int2 = 9999, ext_int3 = 9999, }) => {
    logger_1.default.info('reportTime', reportTime);
    const data = {
        biztype: 'lighthouse_launcher',
        base_url,
        name: 0,
        api: api,
        ext_str1,
        ext_str2,
        ext_str3,
        ext_str4,
        ext_str5,
        ext_str6: reportTime,
        ext_int1: parseInt(`${ext_int1}`),
        ext_int2: parseInt(`${ext_int2}`),
        ext_int3: parseInt(`${ext_int3}`),
        version: packageConfig.version,
        package: packageConfig.name,
        login_type: '0',
        os_type: '0',
        platform: '0',
        uin: '0',
        _ua: '0',
        _uid: '0',
        _network_type: '',
        full_url: '',
        api,
    };
    reportSend('commercial_common_report', data);
};
exports.report = report;
//# sourceMappingURL=dcreport.js.map