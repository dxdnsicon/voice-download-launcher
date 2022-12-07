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
exports.getSSRMd5 = exports.startLighthouse = void 0;
const runner_1 = __importStar(require("./runner"));
const index_1 = require("../../utils/index");
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const task_config_1 = require("../../config/task-config");
const errorCode_1 = require("../../typings/errorCode");
const getSSRMd5_1 = __importStar(require("../../utils/getSSRMd5"));
const logger_1 = __importDefault(require("../../launcher/logger"));
const startLighthouse = async (link, isPc, audits, Fpage_id) => {
    return new Promise((resolve) => {
        try {
            logger_1.default.info('startLighthouse: ', link);
            const child = (0, child_process_1.fork)(path.join(__dirname, '../child_startlighthouse.js'));
            child.send({ page: link, flags: [], isPc, audits, Fpage_id: Fpage_id });
            child.on('message', () => {
                resolve(null);
            });
        }
        catch (e) {
            resolve(null);
        }
    });
};
exports.startLighthouse = startLighthouse;
const getSSRMd5 = (item, times, resolveString, proxy) => {
    return (0, getSSRMd5_1.default)(item, times, resolveString, proxy);
};
exports.getSSRMd5 = getSSRMd5;
const getCDNmd5 = (item, mapMd5, resolveString, proxy) => {
    let { url } = item;
    url = url.replace(/^https/, 'http');
    return new Promise((resolve, reject) => {
        const cmd = `curl ${proxy ? `--proxy ${proxy.ip}:${proxy.port}` : ''} "${url}" ${task_config_1.CHROME_ENV !== 'release' ? `--resolve "${resolveString}"` : ''} | ${task_config_1.MD5_COMMAND}`;
        logger_1.default.trace('Fn getCDNmd5', cmd, JSON.stringify(item));
        (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
            if (error) {
                logger_1.default.info('error:' + stderr);
                reject({
                    code: errorCode_1.ErrorCode.CURL_CSR_ERROR,
                    error: stderr
                });
            }
            else {
                if (stdout) {
                    resolve(stdout.trim());
                }
                else {
                    return false;
                }
            }
        });
    });
};
class CheckPublishStartReport extends runner_1.default {
    static async getMd5FromUrl({ item, times, mapMd5, }, proxy) {
        try {
            let { url } = item;
            if (!url)
                return;
            let targetMd5 = '';
            let md5 = '';
            if ((0, getSSRMd5_1.checkIsSSR)(url)) {
                targetMd5 = await (0, exports.getSSRMd5)(item, times, `i.y.qq.com:80:${task_config_1.N2_IP}`, proxy);
                md5 = (0, index_1.createMd5)(targetMd5);
            }
            else {
                targetMd5 = await getCDNmd5(item, mapMd5, `y.qq.com:80:${task_config_1.YQQ_IP}`, proxy);
                logger_1.default.info(`CDN md5 targetMd5: ${targetMd5}`);
                if (targetMd5.indexOf('d41d8cd98f00b204e9800998ecf8427e') > -1) {
                    logger_1.default.info(`CDN md5 check empty`);
                    md5 = mapMd5;
                }
                else {
                    md5 = (0, index_1.createMd5)(targetMd5);
                }
                logger_1.default.info(`CDN md5 check: md5: ${md5}, mapMd5: ${mapMd5}`);
                if (!targetMd5) {
                    logger_1.default.info(`CDN md5 no targetMd5: ${targetMd5}`);
                    md5 = mapMd5;
                }
                if (md5 !== mapMd5) {
                    logger_1.default.info('CDN md5 change, start ssr check');
                    const ssrMd5 = await (0, exports.getSSRMd5)(item, times, `i.y.qq.com:80:${task_config_1.N2_IP}`, proxy);
                    logger_1.default.info('CDN md5 change, ssrMd5:', ssrMd5);
                    if (ssrMd5) {
                        targetMd5 = ssrMd5;
                        md5 = (0, index_1.createMd5)(ssrMd5);
                    }
                }
            }
            logger_1.default.info(`url: ${item.url}, targetmd5:${targetMd5.substring(0, 500)}, md5: ${md5}`);
            logger_1.default.info(`md5 info compare: old:${mapMd5}, new:${md5}`);
            return md5;
        }
        catch (e) {
            throw e;
        }
    }
    async run({ pageItem, map, resultMap }) {
        try {
            const md5Url = pageItem.url;
            const urlMd5 = (0, index_1.createMd5)(md5Url);
            const md5 = await CheckPublishStartReport.getMd5FromUrl({
                item: pageItem,
                times: 3,
                mapMd5: map[urlMd5]
            });
            if (+pageItem.paramFlag === 1 && pageItem.dyncparamsList && pageItem.dyncparamsList.length > 0) {
                const childFirst = pageItem.dyncparamsList[0];
                logger_1.default.info('pageItem.url change for dyncparam before:', pageItem.url);
                pageItem.url = (0, runner_1.replaceDyncParamUrl)(pageItem, childFirst.key, childFirst.values[0].val);
                logger_1.default.info('pageItem.url change for dyncparam after:', pageItem.url);
            }
            if (map[urlMd5] && md5 && map[urlMd5] !== md5 && map[urlMd5] !== 'dyncParam_isNew') {
                logger_1.default.info(`${pageItem.url}${task_config_1.CHROME_ENV} md5 has change`);
                await (0, exports.startLighthouse)(pageItem.url, pageItem.isPc, pageItem.audits, pageItem.Fpage_id);
            }
            else {
                logger_1.default.info(`${pageItem.url}${task_config_1.CHROME_ENV} md5 no change`);
            }
            resultMap[urlMd5] = md5;
            return {
                resultMap,
                urlMd5,
                md5,
                code: 0
            };
        }
        catch (e) {
            return {
                code: e.code,
                resultMap,
                urlMd5: '',
                md5: '',
                error: e.error
            };
        }
    }
}
exports.default = CheckPublishStartReport;
//# sourceMappingURL=runner-lhreport.js.map