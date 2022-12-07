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
exports.startChildScreenTask = exports.ssimCheckRestore = exports.checkPicSsim = exports.screen = void 0;
const runner_1 = __importDefault(require("./runner"));
const dcreport_1 = require("../../utils/dcreport");
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const path_1 = require("path");
const index_1 = require("../../utils/index");
const log_1 = __importDefault(require("../../utils/log"));
const image_ssim_1 = __importDefault(require("image-ssim"));
const child_process_1 = require("child_process");
const reportError_1 = __importDefault(require("../../utils/reportError"));
const task_config_1 = require("../../config/task-config");
const mysql_1 = require("../../utils/mysql");
const monitor_1 = __importDefault(require("../../gather/monitor"));
const logger_1 = __importDefault(require("../../launcher/logger"));
const getSSRMd5_1 = __importStar(require("../../utils/getSSRMd5"));
const errorCode_1 = require("../../typings/errorCode");
const PNG = require("pngjs").PNG;
const defaultResponse = {
    url: '',
    isPc: false,
    isWhite: false,
    isRestore: false,
    errorFileList: [],
    errorMessageList: [],
    largeFileList: [],
    prevPicName: '',
    nextPicName: '',
    error: '',
    ssrMd5: '',
    ssrError: false,
    ssim: 0,
    mcs: 0,
    childPageList: null,
    ssimThreshold: 0
};
const getDefaultResponse = () => {
    return JSON.parse(JSON.stringify(defaultResponse));
};
async function getImageInfo(filename) {
    try {
        const { file } = await (0, mysql_1.downLoadFile)(filename);
        return wrapImg(file);
    }
    catch (e) {
        return null;
    }
}
function wrapImg(buffer) {
    var _a;
    if (!buffer) {
        return null;
    }
    const pngData = (_a = PNG.sync.read(buffer)) === null || _a === void 0 ? void 0 : _a.data;
    if (!pngData)
        return null;
    return {
        width: 375,
        height: 812,
        channels: 4,
        data: pngData,
    };
}
async function revertPickDiff(md5Name, timeStamps, proxyId = 0) {
    try {
        await (0, mysql_1.copyFile)(`${md5Name}_${proxyId}_next`, `diff_${md5Name}_${proxyId}_next_${timeStamps}`);
        await (0, mysql_1.copyFile)(`${md5Name}_${proxyId}_prev`, `diff_${md5Name}_${proxyId}_prev_${timeStamps}`);
        await (0, mysql_1.copyFile)(`${md5Name}_${proxyId}_next`, `${md5Name}_${proxyId}_next`);
        await (0, mysql_1.copyFile)(`${md5Name}_${proxyId}_prev`, `${md5Name}_${proxyId}_prev`);
        return 1;
    }
    catch (e) {
        return null;
    }
}
var PicStatus;
(function (PicStatus) {
    PicStatus[PicStatus["init"] = 0] = "init";
    PicStatus[PicStatus["ssim"] = 1] = "ssim";
    PicStatus[PicStatus["white"] = 2] = "white";
})(PicStatus || (PicStatus = {}));
async function ssimhandler(pageItem, dimensionsPrev, dimensionsNext, picNext, md5Name, res, param, proxyId = 0, env) {
    try {
        const { url, toPerson, title, ssimThreshold = task_config_1.SSIM_THRESHOLD_DEFAULT, page_id, isPc } = pageItem;
        let { ssim, mcs } = image_ssim_1.default.compare(dimensionsPrev, dimensionsNext);
        ssim = +ssim.toFixed(2);
        mcs = +mcs.toFixed(2);
        res.ssim = ssim;
        res.mcs = mcs;
        res.ssimThreshold = ssimThreshold;
        if (ssim < ssimThreshold || mcs < ssimThreshold) {
            const isRestore = await ssimCheckRestore(picNext, md5Name, proxyId);
            if (isRestore) {
                res.isRestore = isRestore;
            }
            let status = PicStatus.ssim;
            logger_1.default.info(param, `${url} isRestore`, isRestore);
            const isWhite = await checkPicSsim(picNext, 'white', 0.95).catch(() => false);
            if (isWhite) {
                status = PicStatus.white;
                res.isWhite = true;
            }
            const timeStamps = new Date().valueOf();
            const prevDiffName = `${md5Name}_${proxyId}_prev_${timeStamps}`;
            const nextDiffName = `${md5Name}_${proxyId}_next_${timeStamps}`;
            res.prevDiffName = prevDiffName;
            res.nextDiffName = nextDiffName;
            if (!isRestore) {
                logger_1.default.info(param, `monitor notice: ${url} similar alert!!!!, push ${toPerson}`);
            }
            await revertPickDiff(md5Name, timeStamps, proxyId);
        }
        if (ssim > 0) {
            (0, dcreport_1.report)({
                api: 'puppeteer_screenshot',
                base_url: url,
                ext_str1: title,
                ext_str2: toPerson,
                ext_str3: `${page_id}` || '',
                ext_str4: env,
                ext_int1: ssim * 10000,
                ext_int2: mcs * 10000,
                ext_int3: ssimThreshold * 10000
            });
        }
    }
    catch (e) {
        logger_1.default.info('ssim err: ', e);
    }
    return res;
}
async function screen(pageItem, browser, param, proxyId = 0, env, proxy) {
    const { url, isPc } = pageItem;
    param = param || '';
    let res = getDefaultResponse();
    res.url = url;
    res.isPc = isPc;
    const md5Name = (0, index_1.createMd5)(url);
    const prevPicName = `${md5Name}_${proxyId}_prev`;
    const nextPicName = `${md5Name}_${proxyId}_next`;
    res.prevPicName = prevPicName;
    res.nextPicName = nextPicName;
    if ((0, getSSRMd5_1.checkIsSSR)(url)) {
        try {
            const md5 = await (0, getSSRMd5_1.default)(pageItem, 3, `i.y.qq.com:80:${task_config_1.N2_IP}`, proxy);
            res.ssrMd5 = md5;
        }
        catch (e) {
            if ((e === null || e === void 0 ? void 0 : e.code) === errorCode_1.ErrorCode.CURL_SSR_ERROR) {
                res.ssrError = true;
            }
        }
    }
    const page = await browser.newPage();
    try {
        logger_1.default.info(param, 'start move: isPc:', isPc);
        const prevPicExist = await (0, mysql_1.fileIsExist)(prevPicName);
        if (prevPicExist)
            await (0, mysql_1.deleteFile)(prevPicName);
        await (0, mysql_1.renameFile)(nextPicName, prevPicName).catch(() => ({}));
        if (!isPc) {
            await page.emulate(puppeteer_core_1.default.devices['iPhone X']);
        }
        logger_1.default.info(param, 'page init----', md5Name);
        await page.setDefaultTimeout(30000);
        let errorFileList = [];
        let errorMessageList = [];
        let largeFileList = [];
        (0, monitor_1.default)(page, errorFileList, largeFileList, errorMessageList);
        await page.goto(url, {
            waitUntil: 'networkidle0',
        });
        await page.setViewport({
            width: isPc ? 1920 : 375,
            height: isPc ? 1080 : 812,
        });
        logger_1.default.info(param, 'page screenshot start----', md5Name);
        await page.waitForTimeout(3000);
        const nextPic = await page.screenshot({
            path: "./screen.png",
            fullPage: true,
        });
        await (0, mysql_1.saveFile)({ name: nextPicName, mimeType: 'image/png', file: Buffer.from(nextPic) });
        const dimensionsPrev = await getImageInfo(prevPicName);
        const dimensionsNext = wrapImg(nextPic);
        if (dimensionsNext && dimensionsPrev) {
            res = await ssimhandler(pageItem, dimensionsPrev, dimensionsNext, nextPicName, md5Name, res, param, proxyId, env);
        }
        else {
            logger_1.default.info(param, 'ssim empty', url);
        }
        await page.close();
        await browser.close();
        res.errorFileList = errorFileList;
        res.errorMessageList = errorMessageList;
        res.largeFileList = largeFileList;
        return res;
    }
    catch (e) {
        logger_1.default.info(param, 'run error url', url);
        logger_1.default.info(param, 'run error', e);
        res.prevPicName = '';
        res.nextPicName = '';
        res.error = (e === null || e === void 0 ? void 0 : e.toString()) || e;
        (0, reportError_1.default)(url, e.toString());
        await page.close();
        await browser.close();
        return res;
    }
}
exports.screen = screen;
async function checkPicSsim(picNext, picPrev, dimensions) {
    const dimensionsPrev = await getImageInfo(picNext);
    const dimensionsNext = await getImageInfo(picPrev);
    if (dimensionsNext && dimensionsPrev) {
        try {
            const { ssim, mcs } = image_ssim_1.default.compare(dimensionsPrev, dimensionsNext);
            (0, log_1.default)(`ssim ${dimensions} result`, { ssim, mcs });
            if (ssim > dimensions && mcs > dimensions) {
                return true;
            }
        }
        catch (e) {
            (0, log_1.default)(`ssim ${dimensions} result error`, e);
            return false;
        }
    }
    else {
        (0, log_1.default)(`ssim ${dimensions} result error: dimensions empty: `, dimensionsPrev, dimensionsNext);
        return false;
    }
}
exports.checkPicSsim = checkPicSsim;
async function ssimCheckRestore(picNext, md5Name, proxyId = 0) {
    try {
        const prev = `${md5Name}_${proxyId}_prev`;
        const result = await checkPicSsim(picNext, prev, 0.8);
        return result;
    }
    catch (e) {
        return false;
    }
}
exports.ssimCheckRestore = ssimCheckRestore;
async function startChildScreenTask(item, browser, map, resultMap) {
    try {
        return new Promise((resolve) => {
            var _a;
            const webSocketDebuggerUrl = (_a = browser === null || browser === void 0 ? void 0 : browser._connection) === null || _a === void 0 ? void 0 : _a._url;
            const child = (0, child_process_1.fork)((0, path_1.join)(__dirname, './child/child_screenshot.js'));
            child.send({
                pageItem: item,
                webSocketDebuggerUrl,
                page: global.page,
                map,
                resultMap
            });
            child.on('message', (data) => {
                resolve(data);
            });
        });
    }
    catch (e) {
        return null;
    }
}
exports.startChildScreenTask = startChildScreenTask;
class ScreenShot extends runner_1.default {
    async run({ pageItem, browser, param, map, resultMap }) {
        try {
            let data = getDefaultResponse();
            if (browser) {
                data = await screen(pageItem, browser, param, 0, '');
            }
            data.url = pageItem.url;
            if (+pageItem.paramFlag === 1 && pageItem.dyncparamsList && pageItem.dyncparamsList.length > 0) {
                const childData = await startChildScreenTask(pageItem, browser, map, resultMap);
                data.childPageList = childData.childPageList;
                data.resultMap = childData.resultMap;
            }
            else {
                data = await screen(pageItem, browser, param, 0, '');
            }
            return data;
        }
        catch (e) {
            return getDefaultResponse();
        }
    }
}
exports.default = ScreenShot;
//# sourceMappingURL=runner-screenshot.js.map