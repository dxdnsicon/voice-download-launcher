import Runner, { ScreenShotResponse } from './runner';
export declare function screen(pageItem: PageItem, browser: any, param: string, proxyId: number, env: any, proxy?: {
    ip: string;
    port: number;
}): Promise<ScreenShotResponse>;
export declare function checkPicSsim(picNext: string, picPrev: string, dimensions: number): Promise<boolean>;
export declare function ssimCheckRestore(picNext: any, md5Name: string, proxyId?: number): Promise<boolean>;
export declare function startChildScreenTask(item: any, browser: any, map: any, resultMap: any): Promise<ScreenShotResponse>;
declare class ScreenShot extends Runner {
    run({ pageItem, browser, param, map, resultMap }: {
        pageItem: any;
        browser: any;
        param: any;
        map: any;
        resultMap: any;
    }): Promise<ScreenShotResponse>;
}
export default ScreenShot;
