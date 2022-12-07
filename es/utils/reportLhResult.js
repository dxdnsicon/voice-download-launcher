"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAuditNum = exports.getMetricsDetail = void 0;
const axios_1 = __importDefault(require("./axios"));
const task_config_1 = require("../config/task-config");
const log_1 = __importDefault(require("../utils/log"));
const ignoreAudit = [
    'first-contentful-paint',
    'first-meaningful-paint',
    'speed-index',
    'total-blocking-time',
    'interactive',
    'cumulative-layout-shift',
    'largest-contentful-paint',
    'apple-touch-icon',
    'content-width',
    'installable-manifest',
    'pwa-cross-browser',
    'pwa-each-page-has-url',
    'pwa-page-transitions',
    'maskable-icon',
    'service-worker',
    'splash-screen',
    'themed-omnibox',
    'accesskeys',
    'aria-allowed-attr',
    'aria-command-name',
    'aria-hidden-body',
    'aria-hidden-focus',
    'aria-input-field-name',
    'aria-meter-name',
    'aria-progressbar-name',
    'aria-required-attr',
    'aria-required-children',
    'aria-required-parent',
    'aria-roles',
    'aria-toggle-field-name',
    'aria-tooltip-name',
    'aria-treeitem-name',
    'aria-valid-attr-value',
    'aria-valid-attr',
    'button-name',
    'color-contrast',
    'definition-list',
    'dlitem',
    'duplicate-id-active',
    'duplicate-id-aria',
    'form-field-multiple-labels',
    'frame-title',
    'heading-order',
    'html-has-lang',
    'html-lang-valid',
    'input-image-alt',
    'link-name',
    'list',
    'custom-controls-labels',
    'custom-controls-roles',
    'focus-traps',
    'focusable-controls',
    'interactive-element-affordance',
    'logical-tab-order',
    'managed-focus',
    'offscreen-content-hidden',
    'use-landmarks',
    'visual-order-follows-dom',
    'meta-refresh',
    'meta-viewport',
    'object-alt',
    'tabindex',
    'td-headers-attr',
    'th-has-data-cells',
    'valid-lang',
    'video-caption',
    'canonical',
    'crawlable-anchors',
    'hreflang',
    'is-crawlable',
    'link-text',
    'structured-data',
    'meta-description',
    'plugins',
    'robots-txt',
    'autocomplete',
    'uses-responsive-images-snapshot',
    'full-page-screenshot',
    'first-contentful-paint-3g',
    'oopif-iframe-test-audit',
    'predictive-perf',
];
const getMetricsDetail = (lhr) => {
    var _a, _b, _c;
    return ((_c = (_b = (_a = lhr === null || lhr === void 0 ? void 0 : lhr.audits) === null || _a === void 0 ? void 0 : _a.metrics) === null || _b === void 0 ? void 0 : _b.details) === null || _c === void 0 ? void 0 : _c.items[0]) || {};
};
exports.getMetricsDetail = getMetricsDetail;
const computeAuditNum = (lhr, type) => {
    try {
        const list = [];
        const remake = (item) => {
            return {
                id: item.id,
                title: item.title,
                description: item.description,
                score: item.score,
                numericUnit: item.numericUnit,
                numericValue: item.numericValue
            };
        };
        const AuditList = Object.values(lhr.audits) || [];
        AuditList.forEach((item) => {
            {
                if (ignoreAudit.indexOf(item.id) > -1) {
                    return;
                }
                if (type === 'error') {
                    if ((item.score < 0.5 && item.score > 0) || item.score === 0) {
                        list.push(remake(item));
                    }
                }
                else if (type === 'warning') {
                    if ((item.score < 0.9 && item.score >= 0.5) || item.score === null) {
                        list.push(remake(item));
                    }
                }
                else if (type === 'pass') {
                    if (item.score > 0.9) {
                        list.push(remake(item));
                    }
                }
            }
        });
        return list;
    }
    catch (e) {
        (0, log_1.default)('computeAuditNum error', e.toString());
        return [];
    }
};
exports.computeAuditNum = computeAuditNum;
const AnalyserNetWorkRecord = ({ requestedUrl, networkRecords }) => {
    let baseTime = 0;
    let timing = null;
    (0, log_1.default)('check timming');
    networkRecords && networkRecords.forEach((item) => {
        if (item.url === requestedUrl) {
            (0, log_1.default)('check timming', requestedUrl);
            baseTime = item.startTime;
            timing = item.timing;
        }
    });
    const computeDurateTime = (time) => {
        return +((time - baseTime).toFixed(6));
    };
    const records = networkRecords && networkRecords.map(item => {
        let middle = {
            duration: +((item.endTime - item.startTime).toFixed(6)),
            resourceType: item.resourceType,
            requestMethod: item.requestMethod,
            url: item.url,
            startTime: computeDurateTime(item.startTime),
            endTime: computeDurateTime(item.endTime),
            fromMemoryCache: item.fromMemoryCache,
            fromDiskCache: item.fromDiskCache,
            size: item.resourceSize,
            transferSize: item.transferSize,
            resourceSize: item.resourceSize
        };
        return middle;
    });
    return { records, timing };
};
const makeReportData = (lhJson) => {
    try {
        const result = {
            Fpage_url: lhJson.requestedUrl,
            Fdetails: '',
            Ftiming: '',
            Ffcp: lhJson.audits['first-contentful-paint'].numericValue,
            Ffmp: lhJson.audits['first-meaningful-paint'].numericValue,
            Fscore: lhJson.categories.performance.score * 100,
            Ftti: lhJson.audits['interactive'].numericValue,
        };
        return result;
    }
    catch (e) {
        return null;
    }
};
const blockDomain = [
    "//(.*).y.qq.com"
];
const findTImingListMaxAndMin = (list) => {
    if (!list || list.length === 0) {
        return { max: 0, min: 0 };
    }
    let max = list[0].endTime;
    let min = list[0].startTime;
    list.forEach(item => {
        if (item.endTime > max) {
            max = item.endTime;
        }
        if (item.startTime < min) {
            min = item.startTime;
        }
    });
    return { max, min };
};
const ignoreResouce = (x) => {
    try {
        if (x.resourceType !== 'Document') {
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        return true;
    }
};
const AnalyserResourceLoad = (useRecords) => {
    let imageLoad = 0;
    let jsLoad = 0;
    let cssLoad = 0;
    let backendLoad = 0;
    let otherLoad = 0;
    let htmlLoad = 0;
    useRecords && useRecords.forEach((item) => {
        const duration = (item.endTime - item.startTime) * 1000;
        switch (item.resourceType) {
            case 'Document':
                htmlLoad += duration;
                break;
            case 'Stylesheet':
                cssLoad += duration;
                break;
            case 'Script':
                jsLoad += duration;
                break;
            case 'Image':
                imageLoad += duration;
                break;
            case 'XHR':
                backendLoad += duration;
                break;
            default:
                otherLoad += duration;
                break;
        }
    });
    const formatVal = (val) => {
        return +val.toFixed(2);
    };
    imageLoad = formatVal(imageLoad);
    jsLoad = formatVal(jsLoad);
    cssLoad = formatVal(cssLoad);
    backendLoad = formatVal(backendLoad);
    htmlLoad = formatVal(htmlLoad);
    otherLoad = formatVal(otherLoad);
    return { imageLoad, jsLoad, cssLoad, backendLoad, otherLoad, htmlLoad };
};
const rebuildResourceTiming = (records, reporttiming) => {
    const useRecords = records.filter(ignoreResouce);
    reporttiming.resourceTiming = useRecords.map(x => {
        return {
            resource: x.url.replace(/\?.*/, ''),
            startTime: x.startTime,
            endTime: x.endTime,
            transferSize: x.transferSize,
            resourceSize: x.resourceSize
        };
    });
    const { max, min } = findTImingListMaxAndMin(reporttiming.resourceTiming);
    const loadResult = AnalyserResourceLoad(records);
    reporttiming.resourceLoadStart = min * 1000;
    reporttiming.resourceLoadEnd = max * 1000;
    reporttiming.loadDetails = loadResult;
    return reporttiming;
};
async function default_1(lhJson, md5Name, opt, env, from) {
    lhJson.ignoreAudit = ignoreAudit;
    const data = makeReportData(lhJson);
    const { records, timing } = AnalyserNetWorkRecord(lhJson);
    const errorAuditList = (0, exports.computeAuditNum)(lhJson, 'error');
    const warningAuditList = (0, exports.computeAuditNum)(lhJson, 'warning');
    const passAuditList = (0, exports.computeAuditNum)(lhJson, 'pass');
    data.Fdetails = JSON.stringify({
        errorAuditNum: errorAuditList.length,
        warningAuditNum: warningAuditList.length,
        passAuditListNum: passAuditList.length,
    });
    let reporttiming = timing || {};
    if (records) {
        reporttiming = rebuildResourceTiming(records, reporttiming);
    }
    if (reporttiming) {
        data.Ftiming = JSON.stringify(reporttiming);
    }
    if (!data) {
        return;
    }
    const reportData = Object.assign(Object.assign({}, data), { fileName: md5Name, md5: md5Name, Fpage_id: opt.Fpage_id, pushType: opt.pushType || 0, isPc: opt.isPc, env, Ffrom: from, audit: {
            errorAuditList,
        } });
    await (0, axios_1.default)({
        url: task_config_1.JW_SERVER_API,
        method: 'post',
        data: {
            "data": {
                "noLogin": true,
                "getData": {
                    "module": "sql.observe",
                    "method": "reportData",
                    "params": reportData
                }
            }
        }
    });
    reportData.Ftiming = '';
    return reportData;
}
exports.default = default_1;
//# sourceMappingURL=reportLhResult.js.map