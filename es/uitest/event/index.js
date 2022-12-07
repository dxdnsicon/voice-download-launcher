"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPuppeteerPath = void 0;
class Event {
    async run(props) {
        throw new Error('run() has not be decalred');
    }
}
const getPuppeteerPath = async (pathStr, page) => {
    let domNode = null;
    const isXpath = pathStr.indexOf('//') === 0;
    if (isXpath) {
        const xpathDom = await page.$x(pathStr);
        domNode = xpathDom && xpathDom[0];
    }
    else {
        domNode = await page.$(pathStr);
    }
    return domNode;
};
exports.getPuppeteerPath = getPuppeteerPath;
exports.default = Event;
//# sourceMappingURL=index.js.map