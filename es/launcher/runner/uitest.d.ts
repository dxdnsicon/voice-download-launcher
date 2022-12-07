import { Browser } from "puppeteer-core";
import log4js from 'log4js';
export default class SSIMRunner {
    taskConf: TaskConf;
    logger: log4js.Logger;
    browser: Browser;
    constructor(taskConf: TaskConf, logger: log4js.Logger);
    run(): Promise<{
        details: any[];
        taskStatus: import("@tencent/jingwei-common-lib/es/typings/uitest").FcaseExcuteStatus;
        successTotal: number;
        errorTotal: number;
        abnormalTotal: number;
        warningTotal: number;
        doingTotal: number;
        initTotal: number;
        Fpage_id: number;
        Fcase_task_id: string;
        total: number;
    }>;
    clear(): Promise<void>;
}
