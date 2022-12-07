"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lr_common_config_1 = __importDefault(require("./lr-common-config"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const utils_1 = require("./utils");
const config = ({ audits }) => {
    const mobileConf = {
        extends: "lighthouse:default",
        audits: ['metrics/first-contentful-paint-3g'],
        categories: {
            performance: {
                auditRefs: [{ id: "first-contentful-paint-3g", weight: 0 }],
            },
        },
    };
    const mobileAudits = audits.filter((x) => ['H5', 'ALL'].includes(x.type));
    const customAudit = (0, utils_1.makeCustomAuditConf)(mobileAudits);
    return (0, lodash_merge_1.default)(lr_common_config_1.default, mobileConf, customAudit);
};
exports.default = config;
//# sourceMappingURL=mobile-config.js.map