"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JumpLinkType = exports.EventCheckType = exports.FcaseExcuteStatus = void 0;
var uitest_1 = require("@tencent/jingwei-common-lib/es/typings/uitest");
Object.defineProperty(exports, "FcaseExcuteStatus", { enumerable: true, get: function () { return uitest_1.FcaseExcuteStatus; } });
var EventCheckType;
(function (EventCheckType) {
    EventCheckType[EventCheckType["none"] = 0] = "none";
    EventCheckType[EventCheckType["ssim"] = 1] = "ssim";
    EventCheckType[EventCheckType["jumpLink"] = 2] = "jumpLink";
    EventCheckType[EventCheckType["payParam"] = 3] = "payParam";
    EventCheckType[EventCheckType["custom"] = 4] = "custom";
})(EventCheckType = exports.EventCheckType || (exports.EventCheckType = {}));
var JumpLinkType;
(function (JumpLinkType) {
    JumpLinkType[JumpLinkType["all"] = 1] = "all";
    JumpLinkType[JumpLinkType["path"] = 2] = "path";
})(JumpLinkType = exports.JumpLinkType || (exports.JumpLinkType = {}));
//# sourceMappingURL=typings.js.map