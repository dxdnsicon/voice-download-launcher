"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_config_1 = require("./config/task-config");
const node_cron_1 = __importDefault(require("node-cron"));
const getAppConfig_1 = __importDefault(require("./monitor/getAppConfig"));
const logger_1 = __importDefault(require("./launcher/logger"));
const task_1 = __importDefault(require("./launcher/task"));
const axios_1 = __importDefault(require("./utils/axios"));
const utils_1 = require("./utils");
const express_1 = __importDefault(require("express"));
const jingwei_common_lib_1 = require("@tencent/jingwei-common-lib");
const whistle_1 = __importDefault(require("./launcher/whistle"));
const mysql_1 = require("./utils/mysql");
const os_utils_1 = __importDefault(require("os-utils"));
const alertServer_1 = require("./launcher/alertServer");
const lhTps1Counter = (0, utils_1.tpsCounter)(1000 * 60 * 1);
const lhTps5Counter = (0, utils_1.tpsCounter)(1000 * 60 * 5);
const lhTps10Counter = (0, utils_1.tpsCounter)(1000 * 60 * 10);
const ssimTps1Counter = (0, utils_1.tpsCounter)(1000 * 60 * 1);
const ssimTps5Counter = (0, utils_1.tpsCounter)(1000 * 60 * 5);
const ssimTps10Counter = (0, utils_1.tpsCounter)(1000 * 60 * 10);
class Launcher {
    constructor(ip) {
        this.ip = ip;
        logger_1.default.info('Main Process PID ', process.pid);
        this.taskMap = {};
        this.counter = {
            lhSuccess: 0,
            lhError: 0,
            ssimSuccess: 0,
            ssimError: 0,
        };
        this.performance = {
            lhTps1: 0,
            lhTps5: 0,
            lhTps10: 0,
            ssimTps1: 0,
            ssimTps5: 0,
            ssimTps10: 0,
        };
        this.startHttpServer();
        this.startDebugWhistleServer();
        this.setState('running');
        node_cron_1.default.schedule('*/5 * * * * *', this.pingMaster.bind(this));
        node_cron_1.default.schedule('*/5 * * * * *', this.claimTask.bind(this));
        node_cron_1.default.schedule('*/5 * * * *', this.savePerformanceLog.bind(this));
        node_cron_1.default.schedule('*/5 * * * *', this.checkPerformanceData.bind(this));
    }
    startHttpServer() {
        const http = (0, express_1.default)();
        http.use(`/health`, (req, res) => res.json({ state: this.state }));
        http.listen(8080, () => logger_1.default.info(`HTTP Server start at http://127.0.0.1:8080`));
        return http;
    }
    async startDebugWhistleServer() {
        const w2 = await new whistle_1.default({ baseDir: 'debug', port: 8081 }).start();
        w2.setRules(`y.qq.com inner-net://`);
    }
    setState(state) {
        logger_1.default.info(`Launcher.setState ${this.state} ---> ${state}`);
        this.state = state;
    }
    restart() {
        logger_1.default.warn('Restart');
        process.exit(0);
    }
    pingMaster() {
        logger_1.default.info('Launcher.pingMaster');
        const { counter, performance } = this;
        const taskList = Object.values(this.taskMap).map(x => x.taskConf);
        return (0, axios_1.default)({ url: `http://${task_config_1.MASTER_LAUNCHER_DOMAIN}/api/v1/launcher/${this.ip}`, method: 'POST', data: { env: process.env, taskList, counter, performance } });
    }
    async claimTask() {
        logger_1.default.info('Launcher.claimTask');
        if (this.state !== 'running')
            return logger_1.default.warn(`Launcher state ${this.state} break`);
        const runningTaskCount = Object.keys(this.taskMap).length;
        const needClaimTaskCount = Math.max(task_config_1.MAX_TASK_COUNT - runningTaskCount, 0);
        logger_1.default.info('Launcher.claimTask', JSON.stringify({ runningTaskCount, needClaimTaskCount }));
        if (!needClaimTaskCount)
            return logger_1.default.info(`Task Count ${runningTaskCount} skip claim`);
        const taskConfList = await (0, getAppConfig_1.default)(this.ip, needClaimTaskCount);
        this.registerTask(taskConfList);
    }
    registerTask(taskConfList) {
        logger_1.default.info('Launcher.registerTask');
        taskConfList.forEach(async (conf) => {
            const task = new task_1.default(conf);
            logger_1.default.debug('[T] Task Start', conf.id);
            logger_1.default.trace('Task Start', JSON.stringify(conf));
            this.taskMap[conf.id] = task;
            task.on(jingwei_common_lib_1.TaskEvent.SUCCESS, (result) => this.onTaskSuccess(task, result));
            task.on(jingwei_common_lib_1.TaskEvent.ERROR, (err) => this.onTaskError(task, err));
            logger_1.default.debug(`Registe Task`, conf.id, ` current have ${Object.keys(this.taskMap).length} task`);
        });
    }
    async onTaskSuccess(task, result) {
        const { id } = task.taskConf;
        logger_1.default.info('Launcher.onTaskSuccess', id);
        this.deleteTask(task);
        await axios_1.default.post(`http://${task_config_1.MASTER_LAUNCHER_DOMAIN}/api/v1/task/${id}`, result, { params: { ip: this.ip, type: 'SUCCESS' } });
        this.tpsCounter(task);
    }
    tpsCounter(task) {
        if (task.taskConf.ctx.type === jingwei_common_lib_1.TaskType.LH_REPORT) {
            this.counter.lhSuccess += 1;
            this.performance.lhTps1 = lhTps1Counter();
            this.performance.lhTps5 = lhTps5Counter();
            this.performance.lhTps10 = lhTps10Counter();
        }
        else if (task.taskConf.ctx.type === jingwei_common_lib_1.TaskType.SSIM) {
            this.counter.ssimSuccess += 1;
            this.performance.ssimTps1 = ssimTps1Counter();
            this.performance.ssimTps5 = ssimTps5Counter();
            this.performance.ssimTps10 = ssimTps10Counter();
        }
    }
    async onTaskError(task, err) {
        const { id } = task.taskConf;
        logger_1.default.error('Launcher.onTaskError', id);
        this.deleteTask(task);
        await axios_1.default.post(`http://${task_config_1.MASTER_LAUNCHER_DOMAIN}/api/v1/task/${id}`, err, { params: { ip: this.ip, type: 'ERROR' } });
        if (task.taskConf.ctx.type === jingwei_common_lib_1.TaskType.LH_REPORT) {
            this.counter.lhError += 1;
        }
        else if (task.taskConf.ctx.type === jingwei_common_lib_1.TaskType.SSIM) {
            this.counter.ssimError += 1;
        }
    }
    deleteTask(task) {
        logger_1.default.warn('Launcher.deleteTask', task.taskConf.id);
        const { id } = task.taskConf;
        this.taskMap[id] = null;
        delete this.taskMap[id];
        logger_1.default.debug(`Delete Task Done current have ${Object.keys(this.taskMap).length} task`);
    }
    async savePerformanceLog() {
        const now = new Date();
        const todayLogKey = `launcher_performance_log_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDay()}`;
        logger_1.default.warn(`todayLogKey ${todayLogKey}`);
        const todayLogData = await (0, mysql_1.queryConf)(todayLogKey).then(res => res || []);
        logger_1.default.warn(`todayLogData ${typeof todayLogData} ${todayLogData === null || todayLogData === void 0 ? void 0 : todayLogData.length}`);
        todayLogData.push({
            time: now,
            ip: task_config_1.MTKE_POD_IP,
            lhrTps5: this.performance.lhTps5,
            ssimTps5: this.performance.ssimTps5,
            load: Number(Math.round((os_utils_1.default.loadavg(5) / os_utils_1.default.cpuCount() * 100)))
        });
        logger_1.default.warn(`todayLogData.push ${typeof todayLogData} ${todayLogData === null || todayLogData === void 0 ? void 0 : todayLogData.length}`);
        (0, mysql_1.upsertConf)(todayLogKey, todayLogData).catch(e => logger_1.default.error(e));
    }
    checkPerformanceData() {
        if (this.performance.lhTps5 < 10)
            (0, alertServer_1.alertServer)(task_config_1.ALERT_ID_INTERNAL, `Launcher ${task_config_1.MTKE_POD_IP}\nVersion:${task_config_1.MTKE_IMAGE_TAG} 异常\nLHR 任务 5 分钟 TPS 为 ${this.performance.lhTps5}，小于阈值 10`);
        if (this.performance.ssimTps5 < 10)
            (0, alertServer_1.alertServer)(task_config_1.ALERT_ID_INTERNAL, `Launcher ${task_config_1.MTKE_POD_IP}\nVersion:${task_config_1.MTKE_IMAGE_TAG} 异常\nSSIM 任务 5 分钟 TPS 为 ${this.performance.lhTps5}，小于阈值 10`);
    }
}
exports.default = Launcher;
const launcher = new Launcher(task_config_1.MTKE_POD_IP);
logger_1.default.info('Launcher start At', new Date().toLocaleString());
//# sourceMappingURL=index.js.map