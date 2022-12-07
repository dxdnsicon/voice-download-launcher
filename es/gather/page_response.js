"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abnormal_1 = require("../config/abnormal");
exports.default = (res, errorFileList, largeFileList) => {
    const url = res.url();
    const status = res.status();
    let isIgnore = false;
    abnormal_1.IgNoreFileList.forEach((item) => {
        if (url.indexOf(item) > -1) {
            isIgnore = true;
        }
    });
    if (isIgnore)
        return;
    if ([564, 579].indexOf(+status) > -1) {
        return;
    }
    if (!/[3|2](\d*)/.test(`${status}`)) {
        const alreadyItem = errorFileList.filter(x => x.url === url);
        if (alreadyItem && alreadyItem.length > 0) {
            return;
        }
        errorFileList.push({
            status,
            url
        });
    }
    try {
        const headers = res.headers();
        const alreadyItem = largeFileList.filter(x => x.url === url);
        if (alreadyItem && alreadyItem.length > 0) {
            return;
        }
        const size = +headers['content-length'] + (+JSON.stringify(headers).length);
        const type = headers['content-type'];
        let isTarget = false;
        if ((0, abnormal_1.checkIsLargeType)(url)) {
            if (size > 4000000) {
                isTarget = true;
            }
        }
        else {
            if (size > 800000) {
                isTarget = true;
            }
        }
        if (isTarget) {
            largeFileList.push({
                url,
                size,
                type
            });
        }
    }
    catch (e) {
        console.log('query resource error', e);
    }
    return { errorFileList, largeFileList };
};
//# sourceMappingURL=page_response.js.map