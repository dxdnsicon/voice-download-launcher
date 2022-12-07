"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMsg = exports.largeErrorMsg = exports.pageErrorMsg = exports.emptyPageMsg = exports.ssrErrorMsg = exports.getEnvName = void 0;
const index_1 = require("../utils/index");
const ENV_NAME_MAP = {
    PROD: '生产环境',
    TEST: '测试环境',
    DEV: '开发环境',
    PRERELEASE: '预发布环境',
};
const getEnvName = (env) => ENV_NAME_MAP[env] || '';
exports.getEnvName = getEnvName;
const ssrErrorMsg = (item, env) => {
    return `【直出环境警告】
检测到${(0, exports.getEnvName)(env)}页面${item.title}直出环境异常，请相关同学注意！！
页面链接：${item.url}
  `;
};
exports.ssrErrorMsg = ssrErrorMsg;
const emptyPageMsg = (item, env) => {
    return `【白屏警告】:
检测到${(0, exports.getEnvName)(env)}页面${item.title}出现白屏！！，请相关同学注意！！
页面链接：${item.url}
  `;
};
exports.emptyPageMsg = emptyPageMsg;
const pageErrorMsg = (item, errorList, url, env) => {
    let Msg = '';
    errorList.forEach((x, index) => {
        Msg += `\n${index + 1}:${errorList}`;
    });
    return `【JS报错警告】:
检测到${(0, exports.getEnvName)(env)}页面${item.title}中存在报错信息，请相关同学注意！！
页面链接：${url}
报错信息如下：${Msg}
  `;
};
exports.pageErrorMsg = pageErrorMsg;
const largeErrorMsg = (item, largeList, url, env) => {
    let Msg = '';
    largeList.forEach((x, index) => {
        Msg += `\n${index + 1}:${x.url}: size: ${(0, index_1.computeSize)(x.size)}`;
    });
    return `【资源大小警告】:
检测到${(0, exports.getEnvName)(env)}页面${item.title}中存在超大资源，会极大影响页面渲染速度，请相关同学注意！！
页面链接：${url}
超大资源详情如下：${Msg}
  `;
};
exports.largeErrorMsg = largeErrorMsg;
const notFoundMsg = (item, fileList, url, env) => {
    let fileMsg = '';
    fileList.forEach((x, index) => {
        fileMsg += `\n${index + 1}:Code:${x.status},资源链接：${x.url}`;
    });
    return `【异常请求警告】:
检测到${(0, exports.getEnvName)(env)}页面${item.title}出现异常请求，请相关同学注意！！
页面链接：${url}
异常请求列表如下：${fileMsg}
  `;
};
exports.notFoundMsg = notFoundMsg;
//# sourceMappingURL=msg.js.map