interface LighthouseResult {
    audits: any;
    requestedUrl: string;
    categories: any;
    networkRecords: any[];
    ignoreAudit?: string[];
}
export declare const getMetricsDetail: (lhr: any) => any;
export declare const computeAuditNum: (lhr: any, type: 'error' | 'warning' | 'pass') => any[];
export default function (lhJson: LighthouseResult, md5Name: string, opt: any, env: any, from: string): Promise<{
    fileName: string;
    md5: string;
    Fpage_id: any;
    pushType: any;
    isPc: any;
    env: any;
    Ffrom: string;
    audit: {
        errorAuditList: any[];
    };
    Fpage_url: string;
    Fdetails: string;
    Ftiming: string;
    Ffcp: any;
    Ffmp: any;
    Fscore: number;
    Ftti: any;
}>;
export {};
