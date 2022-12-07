"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runner_screenshot_1 = __importDefault(require("../runner-screenshot"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const runner_1 = require("../runner");
const task_config_1 = require("../../../config/task-config");
const runner_lhreport_1 = require("../runner-lhreport");
const index_1 = require("../../../utils/index");
const logger_1 = __importDefault(require("../../../launcher/logger"));
process.on('message', async ({ pageItem, webSocketDebuggerUrl, page, map, resultMap }) => {
    try {
        global.page = page;
        logger_1.default.info('child_screenshot_start', pageItem);
        let childPageList = null;
        const paramsList = pageItem.dyncparamsList;
        paramsList.forEach(async (param) => {
            const keyName = param.key;
            const childList = param.values;
            let childPageList = null;
            if (childList && webSocketDebuggerUrl) {
                const browser = await puppeteer_core_1.default.connect({ browserWSEndpoint: webSocketDebuggerUrl });
                let count = 0;
                const maxSize = Math.min(task_config_1.maxdyncParamsLength, childList.length);
                logger_1.default.info('monitor params maxSize', maxSize);
                for (let i = 0; i < maxSize; i++) {
                    const { val = '', isNew = false } = childList[i];
                    if (!val)
                        return;
                    setTimeout(async () => {
                        try {
                            if (pageItem.url.indexOf(val) > -1) {
                                logger_1.default.info('child url is jingwei config url', val);
                                return;
                            }
                            const cUrl = (0, runner_1.replaceDyncParamUrl)(pageItem, keyName, val);
                            logger_1.default.info(`monitor params_${i}:`, val, 'url:', cUrl);
                            if (pageItem.url.indexOf(cUrl) > -1) {
                                logger_1.default.info(`childtask repeat`, val);
                                count++;
                                return;
                            }
                            const childItem = Object.assign(Object.assign({}, pageItem), { url: cUrl, dyncparamsList: null });
                            const childScreenData = await new runner_screenshot_1.default().run({
                                pageItem: childItem,
                                param: val,
                                browser,
                                map,
                                resultMap
                            });
                            if (!childPageList) {
                                childPageList = [];
                            }
                            const urlMd5 = (0, index_1.createMd5)(cUrl);
                            logger_1.default.info('DyncParam urlmd5, ', urlMd5, childItem.url, 'isNew:', isNew, map[urlMd5]);
                            if (isNew && !map[urlMd5]) {
                                await (0, runner_lhreport_1.startLighthouse)(cUrl, childItem.isPc, childItem.audits, pageItem.page_id);
                                resultMap[urlMd5] = 'dyncParam_isNew';
                            }
                            resultMap[urlMd5] = 'dyncParam_isNew';
                            if (!childPageList) {
                                childPageList = [];
                            }
                            childPageList.push(childScreenData);
                        }
                        catch (e) {
                            logger_1.default.info('childtask error:', e.toString());
                        }
                        count++;
                        if (count === maxSize) {
                            logger_1.default.info('childtask over, childPageList:', childPageList);
                            process.send({
                                childPageList,
                                resultMap
                            });
                            process.exit(0);
                        }
                    }, i * 3000);
                }
            }
        });
    }
    catch (e) {
        logger_1.default.info('child_lighthouse_error', e.toString());
        process.send({});
        process.exit(0);
    }
});
//# sourceMappingURL=child_screenshot.js.map