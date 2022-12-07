"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const typings_1 = require("../typings");
const check_1 = require("@tencent/jingwei-common-lib/es/uitest/check");
class JumpLinkCheck extends index_1.default {
    async run(props) {
        let response = {
            resultType: typings_1.FcaseExcuteStatus.INIT,
            resultMsg: '',
            result: null
        };
        const { page, eventItem: { eventCheck } } = props;
        const { expectation } = eventCheck;
        const { jumpWays, link } = expectation;
        const url = await page.evaluate(() => window.location.href);
        response.result = {
            location: url,
            link,
        };
        const { resultType, resultMsg } = (0, check_1.jumptargetLinkCheck)(jumpWays, link, url);
        response.resultType = resultType;
        response.resultMsg = resultMsg;
        return response;
    }
}
exports.default = JumpLinkCheck;
//# sourceMappingURL=jumpLink.js.map