import { Browser } from "puppeteer-core";
import log4js from 'log4js';
export default class SSIMRunner {
    taskConf: TaskConf;
    logger: log4js.Logger;
    browser: Browser;
    constructor(taskConf: TaskConf, logger: log4js.Logger);
    run(): Promise<import("../../monitor/runners/runner").ScreenShotResponse>;
    clear(): Promise<void>;
}
