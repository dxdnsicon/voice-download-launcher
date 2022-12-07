import Event from './index';
declare class DefaultEvent extends Event {
    run(props: any): Promise<{
        code: number;
    }>;
}
export default DefaultEvent;
