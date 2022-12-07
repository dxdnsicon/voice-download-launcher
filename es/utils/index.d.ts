export declare const writeFile: (dir: any, fileName: any, content: any) => void;
export declare const execCmd: (cmd: string) => Promise<string>;
export declare const checkIsPc: (link: string) => boolean;
export declare const createMd5: (str: string) => string;
export declare const computeSize: (size: number) => string;
export declare const checkPageMd5Change: (page: PageItem, proxyID: any, proxy: {
    ip: string;
    port: number;
}) => Promise<{
    changeWithSaved: boolean;
    changeWithSavedPre: boolean;
    changeWithAll: boolean;
    urlMd5: string;
    savedPreMD5: string;
    savedMD5: string;
    currentMD5: string;
}>;
export declare const tpsCounter: (time: number) => () => number;
export declare const sleep: (time: number) => Promise<unknown>;
export declare const getProxyFlagStr: (port: number, ip?: string) => string;
