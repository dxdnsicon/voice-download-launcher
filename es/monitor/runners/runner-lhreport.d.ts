import Runner, { LhReportResponse } from './runner';
export declare const startLighthouse: (link: string, isPc: boolean, audits: AuditConf[], Fpage_id?: number) => Promise<unknown>;
export declare const getSSRMd5: (item: PageItem, times: number, resolveString: string, proxy?: {
    ip: string;
    port: number;
}) => Promise<string>;
declare class CheckPublishStartReport extends Runner {
    static getMd5FromUrl({ item, times, mapMd5, }: {
        item: PageItem;
        times: number;
        mapMd5: string;
    }, proxy?: {
        ip: string;
        port: number;
    }): Promise<string | null>;
    run({ pageItem, map, resultMap }: {
        pageItem: any;
        map: any;
        resultMap: any;
    }): Promise<LhReportResponse>;
}
export default CheckPublishStartReport;
