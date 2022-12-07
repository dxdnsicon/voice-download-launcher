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
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
const IS_MACOS = (0, os_1.platform)() === 'darwin';
const CONFIG_FILE = process.env.ENV_NAME;
const env = path_1.default.join(__dirname, '../', CONFIG_FILE || (IS_MACOS ? '.env.shining' : '.env.wayne'));
console.log('env', env);
require('dotenv').config({ path: env });
const noticeCustom_1 = __importDefault(require("./utils/noticeCustom"));
const task_1 = __importDefault(require("./launcher/task"));
const logger_1 = __importDefault(require("./launcher/logger"));
const whistle_1 = __importDefault(require("./launcher/whistle"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const task_config_1 = require("./config/task-config");
const chromeLauncher = __importStar(require("chrome-launcher/dist/chrome-launcher"));
const qmfe_lighthouse_1 = __importDefault(require("@tencent/qmfe-lighthouse"));
const uitest_1 = __importDefault(require("./uitest"));
const mock_1 = __importStar(require("./uitest/mock"));
const utils_1 = require("./utils");
const login_1 = require("./monitor/login");
const browser_1 = __importDefault(require("./monitor/browser"));
const aes_1 = require("./utils/aes");
const reportCookies_1 = __importStar(require("./utils/reportCookies"));
const imageSsim_1 = require("./utils/imageSsim");
const utils_2 = require("./utils/utils");
const runner_screenshot_1 = require("./monitor/runners/runner-screenshot");
const jingwei_common_lib_1 = require("@tencent/jingwei-common-lib");
const getTaskConf = () => {
    return {
        id: '本地调试任务',
        ctx: {
            env: jingwei_common_lib_1.EnvType.TEST,
            type: 'SSIM',
            from: 'DEBUGGER',
            page: {
                isPc: true,
                title: 'debug 页面',
                url: 'https://y.qq.com/jzt/waynegong/jingwei.html',
                toPerson: 'waynegong',
                ssimThreshold: 0.5,
                paramFlag: 1,
                proxyContent: `
 11.154.134.187 y.qq.com
         `,
            }
        }
    };
};
class Debugger {
    constructor() {
        var _a;
        const debugFn = (_a = this[process.env.DEBUG_FN]) === null || _a === void 0 ? void 0 : _a.bind(this);
        debugFn ? debugFn() : logger_1.default.warn(`找不到需要调试的函数 DEBUG_FN=${process.env.DEBUG_FN}`);
    }
    async startSSIMTask() {
        const taskConf = getTaskConf();
        taskConf.ctx.type = 'SSIM';
        const task = new task_1.default(taskConf);
    }
    async startUitest() {
        (0, uitest_1.default)(mock_1.default);
    }
    async startPreviewImage() {
        (0, uitest_1.default)(mock_1.mockPreview);
    }
    async getSsim() {
        try {
            logger_1.default.info('ssim getSsim start');
            const fisrtPic = 'https://www.baidu.com/img/flexible/logo/pc/result@2.png';
            const secondPic = 'https://www.baidu.com/img/flexible/logo/pc/result@2.png';
            const firstDetails = await (0, utils_2.getImgBinaryFromHttp)(fisrtPic);
            const secondDetails = await (0, utils_2.getImgBinaryFromHttp)(secondPic);
            const { ssim, mcs } = await (0, imageSsim_1.getSsimOfDyncSize)(firstDetails, secondDetails);
            logger_1.default.info('ssim', ssim, mcs);
        }
        catch (e) {
            logger_1.default.error(e);
        }
    }
    async reportLoginState() {
        const browser = await browser_1.default.initBrowser();
        try {
            const data = await (0, reportCookies_1.queryPlatformAccount)();
            if (!data) {
                throw 'query Account Failed';
            }
            const loginFunc = async (i) => {
                const account = data[i];
                logger_1.default.info('account', account === null || account === void 0 ? void 0 : account.Fuin);
                if (!account.Fuin)
                    return;
                try {
                    const cookies = await (0, login_1.loginMethod)(browser, {
                        uin: account.Fuin,
                        pwd: (0, aes_1.deaes128cbc)(account.Fpasswd, account.Fvi),
                        useSingle: false,
                        skipHttpLoginCheck: false,
                        cookies: account.Fcookies
                    });
                    if (cookies && cookies !== 1) {
                        (0, reportCookies_1.default)({
                            uin: account.Fuin,
                            cookies,
                        });
                    }
                }
                catch (e) {
                    console.log('e', e);
                }
                if (i >= data.length - 1) {
                    await browser.close();
                    return null;
                }
                return await loginFunc(i + 1);
            };
            return await loginFunc(0);
        }
        catch (e) {
            const msg = `【精卫平台登录脚本异常】
 监测到登录脚本异常：${e}`;
            (0, noticeCustom_1.default)(msg, null, {
                key: 'loginerror',
                duration: 60 * 60 * 1000 * 2
            });
            await browser.close();
        }
    }
    async startLHTask() {
        const taskConf = getTaskConf();
        taskConf.ctx.type = 'LH_REPORT';
        const task = new task_1.default(taskConf);
    }
    async startWhistle() {
        const w2 = await new whistle_1.default({ baseDir: 'debug', port: 9876 }).start();
        w2.setRules(`y.qq.com 11.154.134.187 # ${w2.options.port}`);
        setTimeout(() => {
            w2.stop();
        }, 3000);
        return w2;
    }
    async launchChromeApplyWhistle() {
        const w2 = await this.startWhistle();
        const options = {
            chromeFlags: [...task_config_1.CHROME_FLAGS, (0, utils_1.getProxyFlagStr)(w2.options.port)],
            chromePath: task_config_1.CHROME_PATH
        };
        logger_1.default.info('Launch chrome', options);
        const chrome = await chromeLauncher.launch(options);
        return chrome;
    }
    async launchBrowserApplyWhistle() {
        const w2 = await this.startWhistle();
        const launchOptiosn = {
            headless: false,
            executablePath: task_config_1.CHROME_PATH,
            args: [...task_config_1.CHROME_FLAGS, (0, utils_1.getProxyFlagStr)(w2.options.port)]
        };
        logger_1.default.info('Launche Browser', launchOptiosn);
        const browser = await puppeteer_core_1.default.launch(launchOptiosn);
        logger_1.default.info('newPage');
        const whistlePage = await browser.newPage();
        await whistlePage.goto('http://127.0.0.1:9876');
        const page = await browser.newPage();
        await page.goto('https://y.qq.com');
        await page.waitForNavigation({ timeout: 0 });
        await page.screenshot({ path: 'screen.png' });
    }
    async abnormalQuery() {
        const page = getTaskConf();
        const launchOptiosn = {
            headless: false,
            executablePath: task_config_1.CHROME_PATH,
            args: [...task_config_1.CHROME_FLAGS]
        };
        logger_1.default.info('Launche Browser', launchOptiosn);
        const browser = await puppeteer_core_1.default.launch(launchOptiosn);
        const data = await (0, runner_screenshot_1.screen)(page.ctx.page, browser, '', null, env, null);
        console.log('data', data);
    }
    async lighthouseWhitWhistle() {
        const w2 = await new whistle_1.default({ baseDir: 'debug', port: 9876 }).start();
        w2.setRules(`y.qq.com 11.154.134.187`);
        const chromeOptions = {
            chromeFlags: [...task_config_1.CHROME_FLAGS, (0, utils_1.getProxyFlagStr)(w2.options.port)],
            chromePath: task_config_1.CHROME_PATH
        };
        logger_1.default.info('Launch chrome', chromeOptions);
        const chrome = await chromeLauncher.launch(chromeOptions);
        const lhOptions = {
            logLevel: 'debug',
            output: "html",
            onlyCategories: [
                "performance",
                "pwa",
                "seo",
                "best-practices",
                "accessibility",
            ],
            port: chrome.port,
            locale: "zh",
        };
        return await (0, qmfe_lighthouse_1.default)(decodeURIComponent('https://y.qq.com/jzt/waynegong/jingwei.html?jztid=1448'), lhOptions);
    }
    async curlMd5WithWhistle() {
        const w2 = await new whistle_1.default({ port: 8081 }).start();
        w2.setRules(`y.qq.com 11.154.134.187`);
        const port = w2.options.port;
        const res = await (0, utils_1.checkPageMd5Change)(getTaskConf().ctx.page, 5, { port, ip: '127.0.0.1' });
        logger_1.default.info(`checkPageMd5Change ${JSON.stringify(res)}`);
    }
}
new Debugger();
//# sourceMappingURL=debug.js.map