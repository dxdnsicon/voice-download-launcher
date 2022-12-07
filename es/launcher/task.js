"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
const events_1 = require("events");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const task_config_1 = require("../config/task-config");
const logger_1 = __importDefault(require("./logger"));
const ssim_1 = __importDefault(require("./runner/ssim"));
const lighthouse_1 = __importDefault(require("./runner/lighthouse"));
const uitest_1 = __importDefault(require("./runner/uitest"));
const alertServer_1 = require("./alertServer");
const jingwei_common_lib_1 = require("@tencent/jingwei-common-lib");
if (process.env.IS_CHILD) {
    process.on('message', async ({ event, data }) => {
        if (event === jingwei_common_lib_1.TaskEvent.CONSTRUCTOR) {
            new Task(data);
        }
    });
}
class Task extends events_1.EventEmitter {
    constructor(taskConf) {
        super();
        this.taskConf = taskConf;
        this.logger = log4js_1.default.getLogger(`${process.env.IS_CHILD ? `CHILD ${process.pid} - ` : ''}${this.taskConf.id}`);
        if (process.env.IS_CHILD) {
            this.main();
            this.on(jingwei_common_lib_1.TaskEvent.SUCCESS, data => process.send({ event: jingwei_common_lib_1.TaskEvent.SUCCESS, data }));
            this.on(jingwei_common_lib_1.TaskEvent.ERROR, data => process.send({ event: jingwei_common_lib_1.TaskEvent.ERROR, data }));
            process.on('SIGHUP', async () => {
                this.logger.info(`on SIGHUP`);
                await (this === null || this === void 0 ? void 0 : this.runner.clear());
                this.logger.debug('Child process exit 0');
                setTimeout(() => process.exit(0), 1000);
            });
        }
        else {
            this.forkChildProcess();
        }
    }
    forkChildProcess() {
        this.child = (0, child_process_1.fork)(path_1.default.join(__dirname, 'task.js'), [], {
            execPath: process.env.NODE,
            env: Object.assign(Object.assign({}, process.env), { IS_CHILD: '1' })
        });
        logger_1.default.info(`Fork Child process PID: ${this.child.pid} TaskID: ${this.taskConf.id}`);
        this.child.on('message', ({ event, data }) => this.emit(event, data));
        this.on(jingwei_common_lib_1.TaskEvent.SUCCESS, this.killChildProcess.bind(this));
        this.on(jingwei_common_lib_1.TaskEvent.ERROR, this.killChildProcess.bind(this));
        this.child.send({ event: jingwei_common_lib_1.TaskEvent.CONSTRUCTOR, data: this.taskConf });
    }
    killChildProcess() {
        this.logger.debug(`killChildProcess ${this.child.pid}`);
        this.child.kill('SIGHUP');
    }
    async main() {
        var _a;
        try {
            this.logger.info('Task Run ...');
            const result = await this.run();
            this.logger.info('Task Success');
            this.emit(jingwei_common_lib_1.TaskEvent.SUCCESS, Object.assign({ env: this.taskConf.ctx.env }, result));
        }
        catch (e) {
            this.logger.error('Task Error', (e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e), (e === null || e === void 0 ? void 0 : e.stack) || '');
            this.emit(jingwei_common_lib_1.TaskEvent.ERROR, e);
            const ctx = (_a = this.taskConf) === null || _a === void 0 ? void 0 : _a.ctx;
            const page = ctx === null || ctx === void 0 ? void 0 : ctx.page;
            (0, alertServer_1.alertServer)(task_config_1.ALERT_ID_INTERNAL, `任务执行失败 [${this.taskConf.id.slice(0, 8)}](https://${task_config_1.MASTER_LAUNCHER_DOMAIN}/api/v1/task/${this.taskConf.id}) \nLauncher: ${task_config_1.MTKE_POD_IP} Version: ${process.env.MTKE_IMAGE_TAG || 'unknow'}\n任务类型: ${ctx.type} 任务来源: ${ctx.from}\n页面: [${(page === null || page === void 0 ? void 0 : page.title) || (page === null || page === void 0 ? void 0 : page.url)}](${page === null || page === void 0 ? void 0 : page.url})\n${(e === null || e === void 0 ? void 0 : e.message) || ''}\n${(e === null || e === void 0 ? void 0 : e.stack) || ''}\n${JSON.stringify(e)}`);
        }
    }
    async run() {
        const { id, ctx } = this.taskConf;
        const { type } = ctx;
        const runnerMap = {
            [jingwei_common_lib_1.TaskType.LH_REPORT]: lighthouse_1.default,
            [jingwei_common_lib_1.TaskType.SSIM]: ssim_1.default,
            [jingwei_common_lib_1.TaskType.UI_TEST]: uitest_1.default
        };
        const runnerNameMap = {
            [jingwei_common_lib_1.TaskType.LH_REPORT]: 'runner-lhreport',
            [jingwei_common_lib_1.TaskType.SSIM]: 'runner-screenshot',
            [jingwei_common_lib_1.TaskType.UI_TEST]: 'runner-uitest'
        };
        const Runner = runnerMap[type];
        if (!Runner)
            return this.logger.error('Task type error', type);
        this.runner = new Runner(this.taskConf, this.logger);
        this.logger.info('Runner run()');
        const runnerData = {};
        const res = await this.runner.run();
        runnerData[runnerNameMap[type]] = res;
        return res;
    }
}
exports.default = Task;
//# sourceMappingURL=task.js.map