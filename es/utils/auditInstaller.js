"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditInstaller = void 0;
const child_process_1 = require("child_process");
const logger_1 = __importDefault(require("../launcher/logger"));
const persistConfig_1 = __importDefault(require("./persistConfig"));
const execWithPromise = (cmd) => {
    console.log("execWithPromise: ", cmd);
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, (err, stdout, stderr) => {
            if (err)
                reject(stderr);
            else
                resolve(stdout);
        });
    });
};
const auditInstaller = (audits) => {
    const existedAudits = (persistConfig_1.default.get('audits') || []);
    const needInstallAudit = audits
        .filter((audit) => !existedAudits.find(x => x === `${audit.name}@${audit.version}`))
        .map(audit => `${audit.name}@${audit.version}`);
    logger_1.default.info('existedAudits: ', existedAudits);
    logger_1.default.info('needInstallAudit: ', needInstallAudit);
    if (!needInstallAudit.length) {
        logger_1.default.info("无需安装 Audit");
        return Promise.resolve();
    }
    else {
        const cmd = `npm install -g ${needInstallAudit.join(' ')} --registry=https://mirrors.tencent.com/npm/`;
        return execWithPromise(cmd)
            .then(() => persistConfig_1.default.set('audits', [...new Set([...needInstallAudit, ...existedAudits])]));
    }
};
exports.auditInstaller = auditInstaller;
//# sourceMappingURL=auditInstaller.js.map