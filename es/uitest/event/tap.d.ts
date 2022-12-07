import Event from './index';
declare class TapEvent extends Event {
    run(props: any): Promise<{
        code: number;
    }>;
}
export default TapEvent;
