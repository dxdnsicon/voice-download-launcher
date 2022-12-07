"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeUnicode = exports.encodeUnicode = void 0;
const encodeUnicode = str => {
    const res = [];
    for (let i = 0; i < str.length; i++) {
        res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return '\\u' + res.join('\\u');
};
exports.encodeUnicode = encodeUnicode;
const decodeUnicode = (str) => {
    str = str.replace(/\\/g, '%');
    return unescape(str);
};
exports.decodeUnicode = decodeUnicode;
//# sourceMappingURL=unicode.js.map