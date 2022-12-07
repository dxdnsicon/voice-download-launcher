"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const typings_1 = require("../typings");
const check_1 = require("@tencent/jingwei-common-lib/es/uitest/check");
class CustomCHeck extends index_1.default {
    async run(props) {
        let response = {
            resultType: typings_1.FcaseExcuteStatus.INIT,
            resultMsg: '',
            result: null
        };
        const { page, eventItem: { eventCheck } } = props;
        const { expectation } = eventCheck;
        const { jscode } = expectation;
        try {
            const output = await page.evaluate((x) => eval(x), jscode);
            response.result = {
                output: output
            };
            const { resultMsg, resultType } = (0, check_1.customCheck)(output);
            response.resultType = resultType;
            response.resultMsg = resultMsg;
            return response;
        }
        catch (e) {
            response.resultType = typings_1.FcaseExcuteStatus.ERROR;
            response.resultMsg = `用例执行不通过, 用例执行报错`;
            response.result = {
                output: e
            };
            return response;
        }
    }
}
exports.default = CustomCHeck;
//# sourceMappingURL=custom.js.map