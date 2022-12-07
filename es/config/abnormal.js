"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsLargeType = exports.largeFileType = exports.IgNoreFileList = exports.IngoreErrorList = void 0;
exports.IngoreErrorList = [
    'DOMException',
    'Error: Object'
];
exports.IgNoreFileList = [
    '//music.qq.com/unilink/download.html',
    '//stat.y.qq.com/',
    '//stat6.y.qq.com/',
    '//pingfore.qq.com/',
    '//aegis.qq.com/',
    '//nft-user-1255940152.cos.ap-guangzhou.myqcloud.com/'
];
exports.largeFileType = ['.gif', '.mov', '.mp4', '.m4a', '.flac', '.mp3'];
const checkIsLargeType = (url) => {
    let flg = false;
    exports.largeFileType.forEach((item) => {
        if (url.indexOf(item) > -1) {
            flg = true;
        }
    });
    return flg;
};
exports.checkIsLargeType = checkIsLargeType;
//# sourceMappingURL=abnormal.js.map