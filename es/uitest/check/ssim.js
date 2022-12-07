"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const typings_1 = require("../typings");
const image_1 = require("@tencent/jingwei-common-lib/es/lib/image");
const mysql_1 = require("../../utils/mysql");
const logger_1 = __importDefault(require("../../launcher/logger"));
const check_1 = require("@tencent/jingwei-common-lib/es/uitest/check");
const event_1 = require("../event");
class SsimCheck extends index_1.default {
    async run(props) {
        let response = {
            resultType: typings_1.FcaseExcuteStatus.INIT,
            resultMsg: '',
            result: null
        };
        const { page, eventItem: { eventCheck, isPreview }, master_taskid } = props;
        const { expectation } = eventCheck;
        const { ssimDom, ssimImg } = expectation;
        if (!ssimImg) {
            throw '未配置相似度断言期望图片，无法断言此用例';
        }
        let picBinary = null;
        if (ssimDom && (ssimDom === null || ssimDom === void 0 ? void 0 : ssimDom.toLowerCase()) != 'html') {
            const el = await (0, event_1.getPuppeteerPath)(ssimDom, page);
            if (el) {
                picBinary = await el.screenshot({ encoding: 'binary' });
            }
            else {
                throw `未找到${ssimDom}可截图元素，请检查用例逻辑`;
            }
        }
        else {
            picBinary = await page.screenshot({ fullPage: true, encoding: 'binary' });
        }
        const picBinaryFileName = `${isPreview ? 'preview_ssim' : 'ssim'}_${master_taskid}`;
        await (0, mysql_1.saveFile)({ name: picBinaryFileName, mimeType: 'image/png', file: Buffer.from(picBinary) });
        logger_1.default.info(`${master_taskid} picBinaryFileName`, picBinaryFileName);
        if (isPreview) {
            return response;
        }
        const ssimImgTargetBinary = await (0, image_1.getImgBinaryFromHttp)(ssimImg);
        const { ssim, mcs } = (0, image_1.getSsimOfDyncSize)(picBinary, ssimImgTargetBinary, !!ssimDom);
        logger_1.default.info(`${master_taskid} = ssim, mcs`, ssim, mcs);
        const minSsim = Math.min(ssim, mcs);
        response.result = {
            ssim: minSsim,
            resultImageUrl: (0, image_1.getImagePath)(picBinaryFileName),
            checkImageUrl: ssimImg
        };
        if (minSsim) {
            const { resultType, resultMsg } = (0, check_1.ssimCheck)(minSsim);
            response.resultType = resultType;
            response.resultMsg = resultMsg;
        }
        else {
            logger_1.default.info(`${master_taskid} pic details =>`, picBinary, ssimImgTargetBinary);
            response.resultType = typings_1.FcaseExcuteStatus.ABNORMAL;
            response.resultMsg = `相似度值为${minSsim}, 用例执行异常，请检查结果配置`;
            if (isNaN(minSsim)) {
                response.resultMsg = `相似度值为${minSsim}, 用例执行异常, 存在这种情况可能是截图图片与预期图片尺寸不合, 无法对比相似度, 请确认`;
            }
        }
        return response;
    }
}
exports.default = SsimCheck;
//# sourceMappingURL=ssim.js.map