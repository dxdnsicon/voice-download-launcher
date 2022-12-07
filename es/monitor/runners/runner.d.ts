import { ErrorCode } from '../../typings/errorCode';
declare class Runner {
    run(props: RunnerProps): Promise<any>;
}
export default Runner;
export declare const replaceDyncParamUrl: (pageItem: PageItem, keyName: string, val: string) => string;
export declare type LhReportResponse = {
    code: ErrorCode;
    urlMd5: string;
    md5: string;
    resultMap: any;
    error?: string;
};
export declare type ScreenShotResponse = {
    url: string;
    isWhite: boolean;
    isRestore: boolean;
    errorFileList: AbnormalFileItem[];
    errorMessageList: string[];
    largeFileList: LargeFileItem[];
    childPageList: null | ScreenShotResponse[];
    ssim: number;
    mcs: number;
    ssimThreshold: number;
    resultMap: any;
};
