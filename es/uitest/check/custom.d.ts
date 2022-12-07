import Check from './index';
import { FcaseExcuteStatus } from '../typings';
declare class CustomCHeck extends Check {
    run(props: EventProps): Promise<{
        resultType: FcaseExcuteStatus;
        resultMsg: string;
        result: any;
    }>;
}
export default CustomCHeck;
