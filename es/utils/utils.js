"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImagePath = exports.getImgBinaryFromHttp = exports.wrapImg = void 0;
const http_1 = __importDefault(require("http"));
const task_config_1 = require("../config/task-config");
const image_size_1 = __importDefault(require("image-size"));
const PNG = require("pngjs").PNG;
const logger_1 = __importDefault(require("../launcher/logger"));
function wrapImg(buffer, needComputeSize = false) {
    var _a;
    if (!buffer) {
        return null;
    }
    const pngData = (_a = PNG.sync.read(buffer)) === null || _a === void 0 ? void 0 : _a.data;
    if (!pngData)
        return null;
    let width = 375;
    let height = 812;
    if (needComputeSize) {
        const dimensions = (0, image_size_1.default)(buffer);
        width = dimensions.width;
        height = dimensions.height;
    }
    logger_1.default.info(`wrapImg :${needComputeSize}, width: ${width}, height: ${height}`);
    return {
        width,
        height,
        channels: 4,
        data: pngData,
    };
}
exports.wrapImg = wrapImg;
const getImgBinaryFromHttp = (url) => {
    return new Promise((resolve) => {
        url = url.replace('https', 'http');
        http_1.default.get(url, (response) => {
            let data = "";
            response.setEncoding("binary");
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on("end", function () {
                resolve(Buffer.from(data, 'binary'));
            });
        }).on("error", function () {
            resolve('');
        });
    });
};
exports.getImgBinaryFromHttp = getImgBinaryFromHttp;
const getImagePath = (fileName) => {
    return `http://${task_config_1.JINGWEI_DOMAIN}/backend/api/v1/file/${fileName}`;
};
exports.getImagePath = getImagePath;
//# sourceMappingURL=utils.js.map