"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lr_common_config_1 = __importDefault(require("./lr-common-config"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const constants_1 = __importDefault(require("@tencent/qmfe-lighthouse/lighthouse-core/config/constants"));
const utils_1 = require("./utils");
const config = ({ audits }) => {
    const desktopConf = {
        extends: "lighthouse:default",
        settings: {
            formFactor: "desktop",
            throttling: constants_1.default.throttling.desktopDense4G,
            screenEmulation: constants_1.default.screenEmulationMetrics.desktop,
            emulatedUserAgent: constants_1.default.userAgents.desktop,
        },
    };
    const desktopAudits = audits.filter((x) => ['PC', 'ALL'].includes(x.type));
    const customAudit = (0, utils_1.makeCustomAuditConf)(desktopAudits);
    return (0, lodash_merge_1.default)(lr_common_config_1.default, desktopConf, customAudit);
};
exports.default = config;
//# sourceMappingURL=desktop-config.js.map