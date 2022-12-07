"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const task_config_1 = require("../config/task-config");
let browser = null;
exports.default = {
    async initBrowser(flags = []) {
        try {
            const config = {
                args: [
                    ...task_config_1.CHROME_FLAGS,
                    ...flags,
                ],
                executablePath: task_config_1.CHROME_PATH,
                ignoreHTTPSErrors: true,
                headless: false,
                isMobile: true
            };
            browser = await puppeteer_core_1.default.launch(config);
            return browser;
        }
        catch (e) {
            console.error('init browser error', e);
            throw e;
        }
    },
    async closeBrowser() {
        if (browser) {
            await browser.close();
        }
    }
};
//# sourceMappingURL=browser.js.map