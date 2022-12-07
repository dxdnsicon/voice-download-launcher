import { EnvType } from "@tencent/jingwei-common-lib";
declare class Action {
    run(pageItem: PageItem, runnerData: any, env: EnvType): Promise<any>;
}
export default Action;
