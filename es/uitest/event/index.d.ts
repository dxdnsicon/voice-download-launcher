declare class Event {
    run(props: EventProps): Promise<{
        code: number;
    }>;
}
export declare const getPuppeteerPath: (pathStr: string, page: any) => Promise<any>;
export default Event;
