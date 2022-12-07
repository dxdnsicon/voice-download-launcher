export declare function setLoginLocal(cookies: any, uin?: string): Promise<1 | -1>;
export declare function getLoginLocal(uin?: string, cookies?: any): Promise<any>;
export declare function checkLoginOver(localLoginState: any): Promise<boolean>;
export declare type LoginParams = {
    uin: string;
    pwd: string;
    skipLoginCheck: boolean;
    skipHttpLoginCheck: boolean;
    useSingle: boolean;
    url?: string;
    cookies?: any;
};
export declare const loginMethod: (browser: any, opts?: Partial<LoginParams>) => Promise<any>;
export declare const loginFromChromeLauncherMethod: (opts: any) => Promise<any>;
export declare const queryLogin: (browser: any, opts?: Partial<LoginParams>) => Promise<any>;
export declare const login: (browser: any, opts?: Partial<LoginParams>) => Promise<any>;
export declare const loginFromChromeLauncher: (opts: any) => Promise<any>;
export declare const removeLoginState: (browser: any) => Promise<void>;
