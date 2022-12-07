"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const excute_1 = require("./excute");
const logger_1 = __importDefault(require("../launcher/logger"));
const child_process_1 = require("child_process");
const typings_1 = require("./typings");
const path = __importStar(require("path"));
const computeCaseStatus_1 = require("@tencent/jingwei-common-lib/es/uitest/computeCaseStatus");
var CmdName;
(function (CmdName) {
    CmdName["Start"] = "start";
    CmdName["SetResult"] = "setResult";
})(CmdName || (CmdName = {}));
const messageHandle = async ({ cmd, pageDetails, proxyPort, index, size }) => {
    const res = await (0, excute_1.autoTestCore)(pageDetails, index, size, proxyPort);
    process.send({
        cmd: CmdName.SetResult,
        index,
        res,
    });
};
if (process.env.IS_UITEST_CHILD === '1') {
    process.on('message', messageHandle);
}
const forkChild = (pageDetails, index, size, proxyPort, cb) => {
    const child = (0, child_process_1.fork)(path.join(__dirname, 'index.js'), [], {
        execPath: process.env.NODE,
        env: Object.assign(Object.assign({}, process.env), { IS_UITEST_CHILD: '1' })
    });
    logger_1.default.info(`Uitest Fork Child process PID: ${child.pid} index: ${index}`);
    child.send({ cmd: CmdName.Start, pageDetails, index, size, proxyPort });
    child.on('message', cb);
};
const maxLen = 5;
exports.default = async (pageDetails, proxyPort) => {
    try {
        const { caseList, pageItem, Fcase_task_id } = pageDetails.uitest;
        const caseLen = caseList.length;
        const childLength = Math.ceil(caseLen / maxLen);
        let hasOvermap = [];
        let response = {
            details: [],
            taskStatus: typings_1.FcaseExcuteStatus.INIT,
            successTotal: 0,
            errorTotal: 0,
            abnormalTotal: 0,
            warningTotal: 0,
            doingTotal: 0,
            initTotal: 0,
            Fpage_id: pageItem.Fpage_id,
            Fcase_task_id: Fcase_task_id,
            total: caseList.length,
        };
        await new Promise((resolve) => {
            for (let i = 0; i < childLength; i++) {
                forkChild(pageDetails, i, maxLen, proxyPort, ({ index, res }) => {
                    hasOvermap.push(index);
                    for (let i in res) {
                        const item = res[i];
                        if (item) {
                            response.details.push(item);
                        }
                    }
                    if (hasOvermap.length >= childLength) {
                        resolve(response);
                    }
                });
            }
        });
        const status = (0, computeCaseStatus_1.computeTotal)(response.details);
        let taskStatus = (0, computeCaseStatus_1.computeTaskStatus)(response.details);
        response.taskStatus = taskStatus;
        response = Object.assign(Object.assign({}, response), status);
        logger_1.default.info('uitest over', JSON.stringify(response));
        setTimeout(() => {
            process.exit(0);
        }, 500);
        return response;
    }
    catch (e) {
        logger_1.default.info('autoTestCore err:', e);
    }
};
//# sourceMappingURL=index.js.map