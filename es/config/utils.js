"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCustomAuditConf = void 0;
function makeCustomAuditConf(audits) {
    return audits.reduce((o, conf) => {
        var _a;
        const { name, category, weight } = conf;
        if ((_a = o.categories[category]) === null || _a === void 0 ? void 0 : _a.auditRefs) {
            o.categories[category].auditRefs.push({ id: name, weight });
        }
        else {
            o.categories[category] = {
                auditRefs: [{ id: name, weight }]
            };
        }
        return o;
    }, {
        audits: audits.map(x => x.name),
        categories: {}
    });
}
exports.makeCustomAuditConf = makeCustomAuditConf;
//# sourceMappingURL=utils.js.map