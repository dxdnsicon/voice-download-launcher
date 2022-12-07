declare class Result {
    rootName: string;
    constructor();
    getResult(): Promise<string>;
    setResult(map: any): Promise<void>;
}
export default Result;
