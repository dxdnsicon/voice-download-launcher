export declare function wrapImg(buffer: any, needComputeSize?: boolean): {
    width: number;
    height: number;
    channels: number;
    data: any;
};
export declare const getImgBinaryFromHttp: (url: string) => Promise<Buffer | ''>;
export declare const getImagePath: (fileName: string) => string;
