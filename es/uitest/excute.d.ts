export declare const checkNavigatorHasChange: (page: any, pageItem: UiTestConfig['pageItem'], isReload: boolean) => Promise<void>;
export declare const excuteCase: (browser: any, caseItem: CaseItem, pageDetails: PageDetails, proxyPort?: string, pageMap?: any) => Promise<eventResultItem[]>;
export declare const autoTestCore: (pageDetails: PageDetails, index: number, size: number, proxyPort?: string) => Promise<unknown>;
