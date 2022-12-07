"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abnormal_1 = require("../config/abnormal");
exports.default = (message, errorMessageList, alreadyErrorFirstLine) => {
    try {
        if (message && message.length > 20) {
            const firstLine = message && message.split('\n')[0];
            if (!firstLine || !firstLine[0])
                return;
            if (alreadyErrorFirstLine.indexOf(firstLine) > -1)
                return;
            let isIgnore = false;
            abnormal_1.IngoreErrorList.forEach((item) => {
                if (firstLine.indexOf(item) > -1) {
                    isIgnore = true;
                }
            });
            if (!isIgnore) {
                alreadyErrorFirstLine.push(firstLine);
                errorMessageList.push(message);
            }
        }
    }
    catch (e) {
        console.error('pageerror:', e);
    }
};
//# sourceMappingURL=page_error.js.map