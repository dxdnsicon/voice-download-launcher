interface LHAuditConfig {
    audits: string[];
    categories: Record<string, {
        auditRefs: {
            id: string;
            weight: number;
        }[];
    }>;
}
export declare function makeCustomAuditConf(audits: AuditConf[]): LHAuditConfig;
export {};
