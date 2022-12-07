"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("../lighthouse/core"));
const log_1 = __importDefault(require("../utils/log"));
process.on('message', async ({ page, flags, pushType, isPc, audits, Fpage_id }) => {
    try {
        (0, log_1.default)('child_lighthouse_start', page);
        const data = await (0, core_1.default)({
            url: page,
            Fpage_id: Fpage_id,
            flags: flags,
            pushType,
            isPc,
            audits
        });
        (0, log_1.default)('child_lighthouse_over', page);
        process.send(data);
        process.exit(0);
    }
    catch (e) {
        (0, log_1.default)('child_lighthouse_error', e.toString());
        process.send({});
        process.exit(0);
    }
});
//# sourceMappingURL=child_startlighthouse.js.map