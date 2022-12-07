"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.task = void 0;
const result_1 = __importDefault(require("./result"));
const log_1 = __importDefault(require("../utils/log"));
const browser_1 = __importDefault(require("./browser"));
const login_1 = require("./login");
const task_config_1 = __importDefault(require("../config/task-config"));
const { runners = [], actions = [] } = task_config_1.default;
async function task(config, map, resultMap) {
    try {
        const browser = await browser_1.default.initBrowser();
        const isLogin = await (0, login_1.login)(this.browser);
        if (!isLogin) {
            return Promise.resolve({
                code: -1,
                resultMap
            });
        }
        (0, log_1.default)('page length', config.length);
        return new Promise((resolve, reject) => {
            try {
                if (config && config.length > 0) {
                    for (let i = 0; i < config.length; i++) {
                        setTimeout(async () => {
                            try {
                                const item = config[i];
                                (0, log_1.default)('page index:', i, item.title);
                                const runnerData = {};
                                for (let k = 0; k < runners.length; k++) {
                                    const runnername = runners[k];
                                    const runner = require(`./runners/${runnername}`);
                                    if (runner && runner.default) {
                                        const runnerEngine = new runner.default();
                                        const result = await runnerEngine.run({
                                            pageItem: item, browser, map, resultMap
                                        });
                                        runnerData[runnername] = result;
                                        if (result.resultMap) {
                                            resultMap = Object.assign(Object.assign({}, resultMap), result.resultMap);
                                        }
                                    }
                                }
                                for (let k = 0; k < actions.length; k++) {
                                    const actionname = actions[k];
                                    const action = require(`./actions/${actionname}`);
                                    if (action && action.default) {
                                        const actionEngine = new action.default();
                                        await actionEngine.run(item, runnerData);
                                    }
                                }
                            }
                            catch (e) {
                                (0, log_1.default)('monitor task error', e.toString());
                                return null;
                            }
                            if (i === config.length - 1) {
                                (0, log_1.default)('task over, wait for 20s to exit!');
                                setTimeout(async () => {
                                    (0, log_1.default)('task over');
                                    await browser_1.default.closeBrowser();
                                    resolve({
                                        code: 1,
                                        resultMap
                                    });
                                }, 20000);
                            }
                        }, 10000 * i + (global.page || 0) * 2000);
                    }
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }
    catch (e) {
        (0, log_1.default)('task error', e.toString());
        return e;
    }
}
exports.task = task;
const check = async (config, opt) => {
    try {
        const result = new result_1.default();
        const fileContent = await result.getResult();
        let map = {};
        let resultMap = {};
        if (fileContent) {
            try {
                map = JSON.parse(fileContent);
            }
            catch (e) { }
        }
        (0, log_1.default)('task before map: ', map);
        const data = await task(config, map, resultMap);
        resultMap = data.resultMap;
        if (global.page) {
            return resultMap;
        }
        else {
            (0, log_1.default)('task after map: ', resultMap);
            result.setResult(resultMap);
            return resultMap;
        }
    }
    catch (e) {
        (0, log_1.default)('task error', e);
        return null;
    }
};
exports.default = check;
//# sourceMappingURL=task.js.map