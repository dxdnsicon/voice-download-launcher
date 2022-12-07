"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxyFlagStr = exports.sleep = exports.tpsCounter = exports.checkPageMd5Change = exports.computeSize = exports.createMd5 = exports.checkIsPc = exports.execCmd = exports.writeFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const child_process_1 = require("child_process");
const crypto_1 = __importDefault(require("crypto"));
const runner_lhreport_1 = __importDefault(require("../monitor/runners/runner-lhreport"));
const mysql_1 = require("./mysql");
const logger_1 = __importDefault(require("../launcher/logger"));
const writeFile = (dir, fileName, content) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    fs_1.default.writeFileSync((0, path_1.join)(dir + '/' + fileName), JSON.stringify(content));
};
exports.writeFile = writeFile;
const execCmd = async (cmd) => {
    return new Promise((resolve) => {
        logger_1.default.trace(`Exec Command  ${cmd}`);
        (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
            if (error) {
                logger_1.default.error(`Exec Command Error ${stderr}`);
                resolve(null);
            }
            else {
                logger_1.default.debug(`Exec Result ${stdout}`);
                resolve(stdout);
            }
        });
    });
};
exports.execCmd = execCmd;
const checkIsPc = (link) => {
    if (/device\=pc/.test(link)) {
        return true;
    }
    if (/device\=mobile/.test(link)) {
        return false;
    }
    if (/\/m\//.test(link)) {
        return false;
    }
    else if (/\/jzt\//.test(link)) {
        return false;
    }
    else {
        return true;
    }
};
exports.checkIsPc = checkIsPc;
const createMd5 = (str) => {
    return crypto_1.default.createHash('md5').update(str).digest('hex');
};
exports.createMd5 = createMd5;
const computeSize = (size) => {
    let res = '';
    if (size > 1000000) {
        res = `${(size / 1024 / 1024).toFixed(1)}Mb`;
    }
    else if (size > 1000) {
        res = `${(size / 1024).toFixed(1)}Kb`;
    }
    return res;
};
exports.computeSize = computeSize;
const checkPageMd5Change = async (page, proxyID, proxy) => {
    const urlMd5 = (0, exports.createMd5)(page.url);
    const [savedMD5, savedPreMD5] = await (0, mysql_1.queryUrlContentMd5)(page.url, proxyID);
    const currentMD5 = await runner_lhreport_1.default.getMd5FromUrl({ item: page, times: 3, mapMd5: savedMD5 }, proxy);
    const changeWithSaved = currentMD5 !== savedMD5;
    const changeWithSavedPre = currentMD5 !== savedPreMD5;
    const changeWithAll = changeWithSaved && changeWithSavedPre;
    return {
        changeWithSaved,
        changeWithSavedPre,
        changeWithAll,
        urlMd5,
        savedPreMD5,
        savedMD5,
        currentMD5
    };
};
exports.checkPageMd5Change = checkPageMd5Change;
const tpsCounter = (time) => {
    let history = [];
    return () => {
        const now = Date.now();
        history.push(now);
        history = history.filter(x => x > (now - time));
        return history.length;
    };
};
exports.tpsCounter = tpsCounter;
const sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
exports.sleep = sleep;
const getProxyFlagStr = (port, ip = '127.0.0.1') => `--proxy-server=${ip}:${port}`;
exports.getProxyFlagStr = getProxyFlagStr;
//# sourceMappingURL=index.js.map