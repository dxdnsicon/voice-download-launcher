"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importStar(require("./index"));
async function pageClick(page, selector) {
    try {
        await page.evaluate((selector) => {
            var _a;
            var btn = null;
            var isXpath = selector.indexOf('//') === 0;
            if (isXpath) {
                btn = (_a = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)) === null || _a === void 0 ? void 0 : _a.singleNodeValue;
            }
            else {
                btn = window.document.querySelector(selector);
            }
            var event = window.document.createEvent('Events');
            event.initEvent('touchstart', true, true);
            btn.dispatchEvent(event);
            return 1;
        }, selector);
    }
    catch (e) {
        return null;
    }
}
class TapEvent extends index_1.default {
    async run(props) {
        const { page, eventItem } = props;
        const { eventDom } = eventItem;
        const tapDom = await (0, index_1.getPuppeteerPath)(eventDom, page);
        if (!tapDom) {
            throw `未找到指定dom元素:${eventDom}`;
        }
        await pageClick(page, eventDom);
        return {
            code: 0
        };
    }
}
exports.default = TapEvent;
//# sourceMappingURL=tap.js.map