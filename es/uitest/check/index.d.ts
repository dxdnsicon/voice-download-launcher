declare class Check {
    run(props: EventProps): Promise<{
        resultType: FcaseExcuteStatus;
        resultMsg: string;
        result: Record<string, any>;
    }>;
}
export default Check;
