"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsSSR = void 0;
const logger_1 = __importDefault(require("../launcher/logger"));
const child_process_1 = require("child_process");
const errorCode_1 = require("../typings/errorCode");
const task_config_1 = require("../config/task-config");
const checkIsSSR = (url) => {
    let flg = false;
    if (url.indexOf('//i.y.qq.com/') > -1) {
        flg = true;
    }
    if (url.indexOf('//i2.y.qq.com/') > -1) {
        flg = true;
    }
    return flg;
};
exports.checkIsSSR = checkIsSSR;
function getSSRMd5(item, times, resolveString, proxy) {
    let { url } = item;
    url = url.replace(/^https/, 'http');
    return new Promise((resolve, reject) => {
        const cmd = `curl ${proxy ? `--proxy ${proxy.ip}:${proxy.port}` : ''} "${url}" ${task_config_1.CHROME_ENV !== 'release' ? `--resolve "${resolveString}"` : ''}`;
        logger_1.default.debug('Fn getSSRMd5', cmd);
        (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
            if (error) {
                logger_1.default.error('error:' + stderr);
            }
            else {
                try {
                    if (!stdout) {
                        logger_1.default.warn('getSSRMd5:', error, stdout, stderr);
                        if (times > 0) {
                            try {
                                getSSRMd5(item, times - 1, resolveString, proxy).then(rs => {
                                    resolve(rs);
                                }).catch(() => {
                                    reject({
                                        code: errorCode_1.ErrorCode.CURL_SSR_ERROR,
                                    });
                                });
                                return;
                            }
                            catch (e) {
                                reject({
                                    code: errorCode_1.ErrorCode.CURL_SSR_ERROR,
                                });
                                return;
                            }
                        }
                        else {
                            reject({
                                code: errorCode_1.ErrorCode.CURL_SSR_ERROR,
                            });
                            return;
                        }
                    }
                    const indexMd5 = stdout.match(/src\=\"[^\"]*\/[A-Za-z|.]{4,20}\.([0-9A-Za-z]{6,20})\.js/g);
                    let res = '';
                    if (indexMd5) {
                        res = indexMd5.join('');
                    }
                    resolve(res);
                }
                catch (e) {
                    logger_1.default.error(e);
                    resolve(null);
                }
            }
        });
    });
}
exports.default = getSSRMd5;
//# sourceMappingURL=getSSRMd5.js.map