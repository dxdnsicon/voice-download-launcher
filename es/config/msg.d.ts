import { EnvType } from '@tencent/jingwei-common-lib';
export declare const getEnvName: (env: EnvType) => string;
export declare const ssrErrorMsg: (item: PageItem, env: EnvType) => string;
export declare const emptyPageMsg: (item: PageItem, env: EnvType) => string;
export declare const pageErrorMsg: (item: PageItem, errorList: string[], url: string, env: EnvType) => string;
export declare const largeErrorMsg: (item: PageItem, largeList: LargeFileItem[], url: string, env: EnvType) => string;
export declare const notFoundMsg: (item: PageItem, fileList: AbnormalFileItem[], url: string, env: EnvType) => string;
