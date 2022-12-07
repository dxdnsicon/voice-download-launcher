"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const whistle_1 = __importDefault(require("whistle"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./logger"));
const utils_1 = require("./utils");
const task_config_1 = require("../config/task-config");
const kill_port_1 = __importDefault(require("kill-port"));
const DEFAULT_TIMEOUT = 3000;
const DEFAULT_OPTIONS = {
    __maxHttpHeaderSize: 0,
    clearPreOptions: false,
    noGlobalPlugins: false,
    certDir: path_1.default.join(__dirname, '../../public/cert/'),
    mode: 'capture',
    port: 8080
};
class Whistle {
    constructor(originOptions = {}) {
        this.originOptions = originOptions;
    }
    async generatorW2Conf() {
        const port = this.originOptions.port || await (0, utils_1.getPort)();
        const baseDir = this.originOptions.baseDir ? path_1.default.join(task_config_1.WHISTLE_PATH, this.originOptions.baseDir) : path_1.default.join(task_config_1.WHISTLE_PATH, String(port));
        this.options = Object.assign(Object.assign(Object.assign({}, DEFAULT_OPTIONS), this.originOptions), { port,
            baseDir });
    }
    start() {
        return new Promise(async (resolve, reject) => {
            await this.generatorW2Conf();
            const timer = setTimeout(() => {
                reject(new Error('timeout'));
            }, DEFAULT_TIMEOUT);
            const onStarted = () => {
                clearTimeout(timer);
                logger_1.default.info(`process ${process.pid} Whistle start at http://127.0.0.1:${this.options.port}`);
                this.rules = require('whistle/lib/rules/util').rules;
                resolve(this);
            };
            logger_1.default.info(`process ${process.pid} Start whistle ...`, JSON.stringify(this.options));
            this.w2Instance = (0, whistle_1.default)(this.options, onStarted);
        });
    }
    stop() {
        const port = this.options.port;
        logger_1.default.info('kill whistle port', port);
        return (0, kill_port_1.default)(port)
            .then(() => {
            logger_1.default.info(`process ${process.pid}  kill whistle port ${port} success`);
        })
            .catch(e => {
            logger_1.default.error(`process ${process.pid} kill whistle port ${port} error`);
            return Promise.reject(e);
        });
    }
    setRules(val) {
        logger_1.default.debug(`process ${process.pid} whistle ${this.options.port} set rules: ${val}`);
        return this.rules.setDefault(val);
    }
}
exports.default = Whistle;
;
//# sourceMappingURL=whistle.js.map