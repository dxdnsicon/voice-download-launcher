import Task from './launcher/task';
export default class Launcher {
    ip: string;
    state: 'running' | 'unknow';
    taskMap: Record<string, Task>;
    counter: {
        lhSuccess: number;
        lhError: number;
        ssimSuccess: number;
        ssimError: number;
    };
    performance: {
        lhTps1: number;
        lhTps5: number;
        lhTps10: number;
        ssimTps1: number;
        ssimTps5: number;
        ssimTps10: number;
    };
    constructor(ip: string);
    startHttpServer(): any;
    startDebugWhistleServer(): Promise<void>;
    setState(state: Launcher['state']): void;
    restart(): void;
    pingMaster(): import("axios").AxiosPromise<any>;
    claimTask(): Promise<void>;
    registerTask(taskConfList: TaskConf[]): void;
    onTaskSuccess(task: Task, result: any): Promise<void>;
    tpsCounter(task: Task): void;
    onTaskError(task: Task, err: any): Promise<void>;
    deleteTask(task: any): void;
    savePerformanceLog(): Promise<void>;
    checkPerformanceData(): void;
}
