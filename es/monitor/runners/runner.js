"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceDyncParamUrl = void 0;
class Runner {
    async run(props) {
        throw new Error('run() has not be decalred');
    }
}
exports.default = Runner;
const replaceDyncParamUrl = (pageItem, keyName, val) => {
    return pageItem.url.replace(new RegExp(`${keyName}\=[^&]+`, 'gi'), `${keyName}=${val}`);
};
exports.replaceDyncParamUrl = replaceDyncParamUrl;
//# sourceMappingURL=runner.js.map