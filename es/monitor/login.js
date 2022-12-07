"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLoginState = exports.loginFromChromeLauncher = exports.login = exports.queryLogin = exports.loginFromChromeLauncherMethod = exports.loginMethod = exports.checkLoginOver = exports.getLoginLocal = exports.setLoginLocal = void 0;
const path_1 = require("path");
const log_1 = __importDefault(require("../utils/log"));
const index_1 = require("../utils/index");
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const util_1 = __importDefault(require("util"));
const request_1 = __importDefault(require("request"));
const fs_1 = __importDefault(require("fs"));
const task_config_1 = require("../config/task-config");
const logger_1 = __importDefault(require("../launcher/logger"));
const reportCookies_1 = require("../utils/reportCookies");
let isLogin = false;
async function setLoginLocal(cookies, uin = task_config_1.LOGIN_UIN) {
    try {
        const loginData = JSON.stringify({
            "date": new Date().valueOf(),
            "value": cookies
        });
        (0, log_1.default)('login cookies:', loginData);
        const fullName = (0, path_1.join)(task_config_1.LOGIN_PATH, `${uin}.json`);
        if (!fs_1.default.existsSync(task_config_1.CACHE_DIR)) {
            fs_1.default.mkdirSync(task_config_1.CACHE_DIR);
        }
        fs_1.default.writeFileSync(fullName, loginData);
        (0, log_1.default)('login cookies save success');
        return 1;
    }
    catch (e) {
        (0, log_1.default)('login cookies save error', e);
        return -1;
    }
}
exports.setLoginLocal = setLoginLocal;
async function getLoginLocal(uin = task_config_1.LOGIN_UIN, cookies) {
    try {
        const fullName = (0, path_1.join)(task_config_1.LOGIN_PATH, `${uin}.json`);
        const data = fs_1.default.readFileSync(fullName, 'utf-8');
        if (data) {
            (0, log_1.default)('login cookies get success');
            const localLoginState = JSON.parse(data);
            let isAvaible = false;
            if (localLoginState) {
                isAvaible = (new Date().valueOf() - localLoginState.date < task_config_1.LOGIN_REFRESH_TIM);
                (0, log_1.default)('local login isAvaible:', isAvaible);
            }
            return isAvaible ? (cookies !== undefined ? cookies : localLoginState.value) : null;
        }
        else {
            return null;
        }
    }
    catch (e) {
        (0, log_1.default)('login cookies get error', e);
        return null;
    }
}
exports.getLoginLocal = getLoginLocal;
async function pageClick(page, selector) {
    try {
        await page.evaluate(() => {
            var btn = window.document.querySelector('#go');
            var event = window.document.createEvent('Events');
            event.initEvent('touchstart', true, true);
            btn.dispatchEvent(event);
            return 1;
        });
    }
    catch (e) {
        return null;
    }
}
function formatCookie(cookieList) {
    let str = '';
    if (cookieList) {
        cookieList.forEach(x => {
            str += `${x.name}=${x.value};`;
        });
    }
    return str;
}
async function checkLoginOver(localLoginState) {
    var _a;
    try {
        if (localLoginState) {
            const cookies = formatCookie(localLoginState);
            const cmd = `
      curl ${task_config_1.PROXY_STR ? `--proxy ${task_config_1.PROXY_STR}` : ''} --location --request POST 'https://u.y.qq.com/cgi-bin/musicu.fcg' --header 'Cookie: ${cookies}' --data '{
        "comm": {
          "g_tk": 5381,
          "uin": ${task_config_1.LOGIN_UIN},
          "format": "json",
          "inCharset": "utf-8",
          "outCharset": "utf-8",
          "notice": 0,
          "platform": "h5",
          "needNewCode": 1
        },
        "req_0": {
          "module": "userInfo.VipQueryServer",
          "method": "SRFVipQuery_V2",
          "param": {
            "uin_list": [
              "${task_config_1.LOGIN_UIN}"
            ]
          }
        }
      }'
      `;
            console.log('checkLoginOver', cmd);
            const loginCheckData = await (0, index_1.execCmd)(cmd);
            if (loginCheckData) {
                const data = JSON.parse(loginCheckData);
                (0, log_1.default)('loginCheckData code:', (_a = data === null || data === void 0 ? void 0 : data.req_0) === null || _a === void 0 ? void 0 : _a.code);
                if (data.req_0 && data.req_0.code === 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                (0, log_1.default)('loginCheckData null');
                return false;
            }
        }
        else {
            return false;
        }
    }
    catch (e) {
        (0, log_1.default)('loginstate check error:', e);
        return false;
    }
}
exports.checkLoginOver = checkLoginOver;
const loginMethod = async (browser, opts = {}) => {
    try {
        const { uin, pwd, skipLoginCheck, skipHttpLoginCheck, useSingle, cookies } = Object.assign({
            uin: task_config_1.LOGIN_UIN,
            pwd: task_config_1.LOGIN_PWD,
            skipLoginCheck: false,
            skipHttpLoginCheck: true,
            useSingle: true,
            cookies: null
        }, opts);
        if (useSingle && isLogin && !skipLoginCheck) {
            (0, log_1.default)('already login:', uin);
            return;
        }
        (0, log_1.default)('login uin:', uin);
        const page = await browser.newPage();
        let url = 'https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=716027609&daid=383&style=33&login_text=%E7%99%BB%E5%BD%95&hide_title_bar=1&hide_border=1&target=self&s_url=https%3A%2F%2Fgraph.qq.com%2Foauth2.0%2Flogin_jump&pt_3rd_aid=100497308&pt_feedback_link=https%3A%2F%2Fsupport.qq.com%2Fproducts%2F77942%3FcustomInfo%3D.appid100497308&theme=2&verify_theme=';
        const prevLoginUrl = 'https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=100497308&redirect_uri=https%3A%2F%2Fy.qq.com%2Fportal%2Fwx_redirect.html%3Flogin_type%3D1%26surl%3Dhttps%253A%252F%252Fy.qq.com%252Fportal%252Fvipportal%252Findex.html%26use_customer_cb%3D0&state=state&display=pc';
        const localLoginState = await getLoginLocal(uin, cookies);
        if (localLoginState) {
            (0, log_1.default)('use local login state');
            let loginStateAvaiable = true;
            if (!skipHttpLoginCheck) {
                loginStateAvaiable = await checkLoginOver(localLoginState);
            }
            (0, log_1.default)('check httpLoginState', loginStateAvaiable);
            if (loginStateAvaiable) {
                url = 'https://y.qq.com/jzt/comp_apg/8a4098.html?jztid=594';
                await Promise.all(localLoginState.map(pair => {
                    return page.setCookie(pair);
                }));
                (0, log_1.default)('set local login state success');
                return 1;
            }
        }
        await page.setDefaultTimeout(task_config_1.LOGIN_TIMEOUT);
        (0, log_1.default)('login gotopage:');
        await page.goto(url, {
            timeout: task_config_1.LOGIN_TIMEOUT,
            waitUntil: 'networkidle0',
        });
        (0, log_1.default)('login setViewport:');
        await page.setViewport({
            width: 375,
            height: 812,
        });
        (0, log_1.default)('login click:');
        await page.click('#switcher_plogin');
        try {
            await page.waitForTimeout(1000);
            await page.click('#uin_del');
            await page.type('#u', '', { delay: 100 });
        }
        catch (e) { }
        await page.type('#u', uin, { delay: 100 });
        await page.waitForTimeout(500);
        await page.type('#p', pwd, { delay: 100 });
        await page.waitForTimeout(500);
        await page.click('#login_button');
        (0, log_1.default)('login clicksuccess:');
        if (task_config_1.DEBUG) {
            setTimeout(async () => {
                await page.screenshot({ path: (0, path_1.join)(task_config_1.baseDir, 'login.png') });
            }, 3000);
        }
        await page.waitForNavigation();
        await page.goto(prevLoginUrl, {
            timeout: task_config_1.LOGIN_TIMEOUT,
            waitUntil: 'networkidle0',
        });
        await page.evaluate(() => {
            window.postMessage("{\"action\":\"qclogin_success\"}", "https://graph.qq.com");
        });
        await page.waitForTimeout(3000);
        (0, log_1.default)('login success');
        isLogin = true;
        const ressponseCookies = await page.cookies();
        (0, log_1.default)('cookies', ressponseCookies);
        await page.close();
        await setLoginLocal(ressponseCookies, uin);
        return ressponseCookies;
    }
    catch (e) {
        logger_1.default.error('login err:', e);
        return null;
    }
};
exports.loginMethod = loginMethod;
const loginFromChromeLauncherMethod = async (opts) => {
    try {
        const resp = await util_1.default.promisify(request_1.default)(`http://localhost:${opts.port}/json/version`);
        const { webSocketDebuggerUrl } = JSON.parse(resp.body);
        const browser = await puppeteer_core_1.default.connect({ browserWSEndpoint: webSocketDebuggerUrl });
        return await (0, exports.queryLogin)(browser, {
            skipLoginCheck: true,
            skipHttpLoginCheck: false,
            url: opts === null || opts === void 0 ? void 0 : opts.url
        });
    }
    catch (e) {
        (0, log_1.default)('login error', e);
        return null;
    }
};
exports.loginFromChromeLauncherMethod = loginFromChromeLauncherMethod;
const queryLogin = async (browser, opts = {}) => {
    const { uin, url } = Object.assign({
        url: opts.url,
        uin: task_config_1.LOGIN_UIN,
        pwd: task_config_1.LOGIN_PWD,
        skipLoginCheck: false,
        skipHttpLoginCheck: true,
        useSingle: true
    }, opts);
    const accountInfo = await (0, reportCookies_1.queryAccount)(uin, url);
    const loginStateAvaiable = await checkLoginOver(accountInfo);
    logger_1.default.info('accountInfo loginStateAvaiable', loginStateAvaiable);
    if (!loginStateAvaiable) {
        return null;
    }
    else {
        const page = await browser.newPage();
        const url = 'https://y.qq.com/jzt/comp_apg/8a4098.html?jztid=594';
        await Promise.all(accountInfo.map(pair => {
            return page.setCookie(pair);
        }));
        logger_1.default.info('set api login state success');
        await page.close();
        return accountInfo;
    }
};
exports.queryLogin = queryLogin;
exports.login = exports.queryLogin;
exports.loginFromChromeLauncher = exports.loginFromChromeLauncherMethod;
const removeLoginState = async (browser) => {
    const removeCookiePage = await browser.newPage();
    await removeCookiePage.setCookie({
        domain: '.qq.com',
        name: 'uin',
        value: '',
    });
    await removeCookiePage.setCookie({
        domain: '.y.qq.com',
        name: 'qm_keyst',
        value: '',
    });
    await removeCookiePage.setCookie({
        domain: '.qq.com',
        name: 'login_type',
        value: '',
    });
};
exports.removeLoginState = removeLoginState;
//# sourceMappingURL=login.js.map