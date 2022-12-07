interface WhistleOptions {
    baseDir: string;
    port: number;
}
export default class Whistle {
    originOptions: Partial<WhistleOptions>;
    options: WhistleOptions;
    private rules;
    private w2Instance;
    constructor(originOptions?: Partial<WhistleOptions>);
    generatorW2Conf(): Promise<void>;
    start(): Promise<Whistle>;
    stop(): any;
    setRules(val: any): any;
}
export {};
