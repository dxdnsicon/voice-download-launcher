"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typings_1 = require("./typings");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../launcher/logger"));
exports.default = async (page, { eventItem, Fcase_id, Fcase_history_id, index, pageItem, master_taskid }) => {
    var _a, _b;
    try {
        let response = {
            Fcase_id,
            Fcase_history_id,
            resultIndex: index,
            resultType: typings_1.FcaseExcuteStatus.INIT,
            resultMsg: '',
            result: null,
            expectation: null
        };
        const { eventType } = eventItem;
        if (eventType) {
            logger_1.default.info('event start: ', eventType);
            const eventMethod = (_a = require(`./event/${eventType}`)) === null || _a === void 0 ? void 0 : _a.default;
            if (eventMethod) {
                await new eventMethod().run({
                    page, eventItem, pageItem, master_taskid
                });
                logger_1.default.info('event end: ', eventType);
            }
        }
        if (eventItem.delay) {
            logger_1.default.info('delay:', eventItem.delay);
            await (0, utils_1.sleep)(eventItem.delay || 2000);
        }
        const { eventCheck } = eventItem;
        if (eventCheck && eventCheck.eventCheckType) {
            const { eventCheckType, expectation } = eventCheck;
            logger_1.default.info('event check start: ', eventCheckType);
            const checkMethod = (_b = require(`./check/${typings_1.EventCheckType[eventCheckType]}`)) === null || _b === void 0 ? void 0 : _b.default;
            if (checkMethod) {
                const checkData = await new checkMethod().run({
                    page, eventItem, pageItem, master_taskid
                });
                logger_1.default.info('event check response: ', checkData);
                response = Object.assign(Object.assign(Object.assign({}, response), checkData), { expectation });
            }
        }
        return response;
    }
    catch (e) {
        if (eventItem.delay) {
            logger_1.default.info('delay:', eventItem.delay);
            await (0, utils_1.sleep)(eventItem.delay || 2000);
        }
        logger_1.default.info('excuteSingleEvent error:', e === null || e === void 0 ? void 0 : e.toString(), e);
        return {
            Fcase_id,
            Fcase_history_id,
            resultIndex: index,
            resultType: typings_1.FcaseExcuteStatus.ABNORMAL,
            resultMsg: null,
            result: null,
            expectation: null,
            error: (e === null || e === void 0 ? void 0 : e.toString()) || e
        };
    }
};
//# sourceMappingURL=core.js.map