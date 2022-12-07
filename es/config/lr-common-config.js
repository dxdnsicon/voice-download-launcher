"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    settings: {
        maxWaitForFcp: 15 * 1000,
        maxWaitForLoad: 35 * 1000,
        skipAudits: [
            "uses-http2",
            "service-worker",
            "installable-manifest",
            "apple-touch-icon",
            "themed-omnibox",
            "maskable-icon",
            "label",
            "color-contrast",
            "splash-screen",
        ],
    },
    audits: [],
    categories: {
        performance: {
            auditRefs: [],
        },
    },
};
//# sourceMappingURL=lr-common-config.js.map