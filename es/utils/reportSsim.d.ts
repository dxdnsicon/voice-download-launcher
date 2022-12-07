import { EnvType } from '@tencent/jingwei-common-lib';
interface SsimReportParams {
    followers: string;
    ssimThreshold: number;
    page_name: string;
    prevDiffName: string;
    nextDiffName: string;
    status: number;
    ssim: number;
    mcs: number;
    page_id: number;
    page_url: string;
    isPc: boolean;
    env: EnvType;
}
declare const _default: (opt: SsimReportParams) => void;
export default _default;
