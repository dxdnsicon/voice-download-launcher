interface Options {
    url: string;
    Fpage_id?: number;
    flags?: string[];
    isPc?: boolean;
    toPerson?: string;
    pushType?: number;
    target?: string;
    cb?: null | (({}: {
        finalUrl: string;
        md5: string;
    }) => void);
    outputDir?: string;
    audits?: AuditConf[];
}
declare const core: (opt: Options) => Promise<any>;
export default core;
