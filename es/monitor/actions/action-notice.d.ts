import Action from './action';
import { LhReportResponse, ScreenShotResponse } from '../runners/runner';
import { EnvType } from '@tencent/jingwei-common-lib';
export declare const noticeHandle: (notice: NoticeConf[], env: EnvType) => void;
export declare const handleLhNotice: (pageItem: PageItem, data: LhReportResponse, env: EnvType) => any[];
export declare const handleScreenShotNotice: (pageItem: PageItem, data: ScreenShotResponse, env: EnvType) => any[];
declare class ActionNotice extends Action {
    run(pageItem: any, runnerData: any, env: any): Promise<void>;
}
export default ActionNotice;
