"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDuration = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["ABNORMALRESOURCE"] = "abnormalresource";
    MessageType["LARGERESOURCE"] = "largeresource";
    MessageType["SSRERROR"] = "ssrerror";
    MessageType["EMPTYPAGE"] = "emptypage";
    MessageType["PAGEERROR"] = "pageerror";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var MessageDuration;
(function (MessageDuration) {
    MessageDuration[MessageDuration["DEFAULT"] = 21600000] = "DEFAULT";
    MessageDuration[MessageDuration["ABNORMALRESOURCE"] = 3600000] = "ABNORMALRESOURCE";
    MessageDuration[MessageDuration["SSRERROR"] = 600000] = "SSRERROR";
    MessageDuration[MessageDuration["EMPTYPAGE"] = 0] = "EMPTYPAGE";
})(MessageDuration = exports.MessageDuration || (exports.MessageDuration = {}));
//# sourceMappingURL=global.js.map