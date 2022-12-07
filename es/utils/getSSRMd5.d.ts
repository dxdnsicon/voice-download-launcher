export declare const checkIsSSR: (url: string) => boolean;
export default function getSSRMd5(item: PageItem, times: number, resolveString: string, proxy?: {
    ip: string;
    port: number;
}): Promise<string>;
