"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSsimOfDyncSize = void 0;
const image_ssim_1 = __importDefault(require("image-ssim"));
const utils_1 = require("./utils");
const formatSsim = (num) => {
    return +(num.toFixed(3));
};
const getSsimOfDyncSize = (picBinary, ssimImgTargetBinary, needComputeSize = false) => {
    const { ssim, mcs } = image_ssim_1.default.compare((0, utils_1.wrapImg)(picBinary, needComputeSize), (0, utils_1.wrapImg)(ssimImgTargetBinary, needComputeSize));
    return {
        ssim: formatSsim(ssim),
        mcs: formatSsim(mcs)
    };
};
exports.getSsimOfDyncSize = getSsimOfDyncSize;
exports.default = (picBinary, ssimImgTargetBinary) => {
    const { ssim, mcs } = image_ssim_1.default.compare((0, utils_1.wrapImg)(picBinary), (0, utils_1.wrapImg)(ssimImgTargetBinary));
    return {
        ssim: formatSsim(ssim),
        mcs: formatSsim(mcs)
    };
};
//# sourceMappingURL=imageSsim.js.map