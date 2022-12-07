export declare const mockPreview: {
    master_taskid: string;
    user: string;
    env: string;
    isPreview: boolean;
    uitest: {
        pageItem: {
            Fpage_id: string;
            Fpage_url: string;
            dyncparam: {
                keyName: string;
                val: string;
            };
            isPreview: boolean;
            caseList: {
                account: {
                    uin: string;
                };
                eventList: {
                    eventType: string;
                    eventCheck: {
                        eventCheckType: string;
                        expectation: {
                            ssimImg: string;
                        };
                    };
                    isPreview: boolean;
                }[];
            }[];
        };
        caseList: {
            account: {
                uin: string;
            };
            eventList: {
                eventType: string;
                eventCheck: {
                    eventCheckType: number;
                    expectation: {
                        ssimImg: string;
                    };
                };
                isPreview: boolean;
            }[];
        }[];
    };
    proxyContent: string;
};
declare const _default: {
    master_taskid: string;
    user: string;
    env: string;
    uitest: {
        Fcase_task_id: string;
        pageItem: {
            Fpage_id: number;
            Fpage_url: string;
            Fpage_name: string;
            isPc: boolean;
            Fparam_flag: number;
            Fparam_key: string;
            dyncparam: {
                keyName: string;
                val: string;
            };
        };
        qqmusic: {
            devops: {
                build_id: string;
                build_name: string;
                cur_os: string;
                pipeline_id: string;
                devops_url: string;
            };
            wetest: {
                device_choose_type: number;
                device_num: number;
            };
        };
        proxyContent: any;
        caseList: ({
            Fcase_id: string;
            Fcase_status: string;
            Fevent_result: any[];
            account: {
                Faccount_id: string;
                uin: string;
                password: string;
                Fvi: string;
            };
            env: string;
            eventList: {
                delay: string;
                eventDom: string;
                eventType: string;
                eventCheck: {
                    expectation: {
                        jscode: string;
                    };
                    eventCheckType: number;
                };
            }[];
            eventName: string;
            eventIndex: number;
            Fcreate_time: string;
            Fupdate_time: string;
            Fcase_history_id: string;
        } | {
            Fcase_id: string;
            Fcase_status: string;
            Fevent_result: any[];
            account: {
                Faccount_id: string;
                uin: string;
                password: string;
                Fvi: string;
            };
            env: string;
            eventList: {
                delay: string;
                eventDom: string;
                eventType: string;
                eventCheck: {
                    expectation: {
                        link: string;
                        jumpWays: number;
                    };
                    eventCheckType: number;
                };
            }[];
            eventName: string;
            eventIndex: number;
            Fcreate_time: string;
            Fupdate_time: string;
            Fcase_history_id: string;
        })[];
    };
};
export default _default;
