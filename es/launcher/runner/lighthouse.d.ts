import log4js from "log4js";
import * as chromeLauncher from "chrome-launcher/dist/chrome-launcher";
export default class LighthouseRunner {
    taskConf: TaskConf;
    logger: log4js.Logger;
    chrome: chromeLauncher.LaunchedChrome;
    constructor(taskConf: TaskConf, logger: log4js.Logger);
    run(): Promise<{
        fileName: string;
        md5: string;
        Fpage_id: any;
        pushType: any;
        isPc: any;
        env: any;
        Ffrom: string;
        audit: {
            errorAuditList: any[];
        };
        Fpage_url: string;
        Fdetails: string;
        Ftiming: string;
        Ffcp: any;
        Ffmp: any;
        Fscore: number;
        Ftti: any;
    }>;
    lighthouse(port: any): Promise<any>;
    clear(): Promise<void>;
}
