import Check from './index';
import { FcaseExcuteStatus } from '../typings';
declare class SsimCheck extends Check {
    run(props: EventProps): Promise<{
        resultType: FcaseExcuteStatus;
        resultMsg: string;
        result: any;
    }>;
}
export default SsimCheck;
