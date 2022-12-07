/// <reference types="node" />
import log4js from "log4js";
import { EventEmitter } from 'events';
import { ChildProcess } from 'child_process';
import SSIMRunner from "./runner/ssim";
import LighthouseRunner from "./runner/lighthouse";
export default class Task extends EventEmitter {
    taskConf: TaskConf;
    child: ChildProcess;
    logger: log4js.Logger;
    runner: LighthouseRunner | SSIMRunner;
    constructor(taskConf: TaskConf);
    forkChildProcess(): void;
    killChildProcess(): void;
    main(): Promise<void>;
    run(): Promise<void | import("../monitor/runners/runner").ScreenShotResponse | {
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
}
