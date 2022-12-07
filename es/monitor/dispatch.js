"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = __importDefault(require("./result"));
const log_1 = __importDefault(require("../utils/log"));
const index_1 = require("../utils/index");
const clearlog_1 = __importDefault(require("../protect/clearlog"));
const browser_1 = __importDefault(require("./browser"));
const login_1 = require("./login");
const alertTemporary_1 = require("../utils/alertTemporary");
var CmdName;
(function (CmdName) {
    CmdName["Start"] = "Start";
    CmdName["Over"] = "Over";
    CmdName["SetResult"] = "SetResult";
})(CmdName || (CmdName = {}));
let mapCache = {};
let maxchildProcessNum = 0;
let mapLen = 0;
const messageHandle = async ({ cmd, page, opt, map, webSocketDebuggerUrl }) => {
    try {
        (0, log_1.default)('message.CmdName', cmd);
        switch (cmd) {
            case CmdName.Start:
                (0, log_1.default)('child_message:', page);
                global.page = page;
                global.webSocketDebuggerUrl = webSocketDebuggerUrl;
                (0, log_1.default)('webSocketDebuggerUrl:', global.webSocketDebuggerUrl);
            case CmdName.SetResult:
                if (global.page) {
                    return;
                }
                mapLen++;
                mapCache = Object.assign(Object.assign({}, mapCache), map);
                (0, log_1.default)('setResult', mapLen, 'child_id:', page, maxchildProcessNum);
                if (mapLen === maxchildProcessNum) {
                    const result = new result_1.default();
                    result.setResult(mapCache);
                    await clearProcess(false);
                    process.exit(0);
                }
                break;
            default:
                break;
        }
    }
    catch (e) {
        (0, alertTemporary_1.writeAlertTemporary)(`【精卫平台监控脚本异常】
    主进程与子进程通信发生错误 ${e.toString()}`);
        (0, log_1.default)('childmap error:', e.toString());
        return null;
    }
};
const clearCmd = async (isStart) => {
    if (isStart) {
        (0, clearlog_1.default)();
        await (0, index_1.execCmd)("ps aux | grep 'chrome' |  awk '{print $2}' | xargs kill -9");
    }
    else {
        await (0, index_1.execCmd)("ps aux | grep 'qmfe-h5-lighthouse-launcher' |  awk '{print $2}' | xargs kill -9");
    }
    return true;
};
const clearProcess = async (isStart) => {
    try {
        const date = new Date();
        const hour = date.getHours();
        const minites = date.getMinutes();
        (0, log_1.default)('clear process:', hour, minites, isStart);
        if (+hour === 0 && +minites <= 6) {
            (0, log_1.default)('clear process start');
            clearCmd(isStart);
            (0, log_1.default)('clear process end');
        }
        return true;
    }
    catch (e) {
        return null;
    }
};
process.on('message', messageHandle);
const beforeCheck = async (opt = {}) => {
    var _a;
    try {
        await clearProcess(true);
        const browser = await browser_1.default.initBrowser();
        const webSocketDebuggerUrl = (_a = browser === null || browser === void 0 ? void 0 : browser._connection) === null || _a === void 0 ? void 0 : _a._url;
        await (0, login_1.login)(browser, { skipHttpLoginCheck: false });
    }
    catch (e) {
        (0, log_1.default)('beforeCheck error', e.toString());
        return null;
    }
};
const argv = process.argv;
if (argv && argv[2]) {
    const page = argv[2];
    (0, log_1.default)('child_mod_page', page);
}
exports.default = beforeCheck;
//# sourceMappingURL=dispatch.js.map