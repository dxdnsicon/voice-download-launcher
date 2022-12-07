import { FcaseExcuteStatus } from './typings';
declare const _default: (pageDetails: PageDetails, proxyPort?: string) => Promise<{
    details: any[];
    taskStatus: FcaseExcuteStatus;
    successTotal: number;
    errorTotal: number;
    abnormalTotal: number;
    warningTotal: number;
    doingTotal: number;
    initTotal: number;
    Fpage_id: number;
    Fcase_task_id: string;
    total: number;
}>;
export default _default;
