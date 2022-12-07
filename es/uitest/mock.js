"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPreview = void 0;
exports.mockPreview = {
    "master_taskid": "9445fb26-2635-4db7-9086-7855b0b33be5",
    "user": "shiningding",
    "env": "TEST",
    "isPreview": true,
    "uitest": {
        "pageItem": {
            "Fpage_id": "17",
            "Fpage_url": "https://i.y.qq.com/n2/m/myvip/v9/index.html?_hidehd=1&_hdct=2&_miniplayer=1",
            "dyncparam": {
                "keyName": "",
                "val": ""
            },
            "isPreview": true,
            "caseList": [
                {
                    "account": {
                        "uin": "3304864593"
                    },
                    "eventList": [
                        {
                            "eventType": "default",
                            "eventCheck": {
                                "eventCheckType": "1",
                                "expectation": {
                                    "ssimImg": "1"
                                }
                            },
                            "isPreview": true
                        }
                    ]
                }
            ]
        },
        "caseList": [
            {
                "account": {
                    "uin": "3304864593"
                },
                "eventList": [
                    {
                        "eventType": "default",
                        "eventCheck": {
                            "eventCheckType": 1,
                            "expectation": {
                                "ssimImg": "1"
                            }
                        },
                        "isPreview": true
                    }
                ]
            }
        ]
    },
    "proxyContent": ""
};
exports.default = {
    master_taskid: '4a407695-5a13-4272-8a80-20064221f5c9',
    user: 'shiningding',
    env: 'PROD',
    uitest: {
        Fcase_task_id: '4a407695-5a13-4272-8a80-20064221f5c9',
        pageItem: {
            Fpage_id: 17,
            Fpage_url: 'https://i.y.qq.com/n2/m/myvip/v9/index.html?_hidehd=&amp;_hdct=&amp;_miniplayer=',
            Fpage_name: '会员中心V9',
            isPc: false,
            Fparam_flag: 0,
            Fparam_key: '',
            dyncparam: {
                keyName: '',
                val: '',
            },
        },
        qqmusic: {
            devops: {
                build_id: '',
                build_name: 'qqmusic_64_11.10.0.8_android_r9b6eff73_20221024050051_release.apk',
                cur_os: 'android',
                pipeline_id: 'p-64a01972b8684e85a70a415dbb014dd6',
                "devops_url": "https://devops.woa.com/console/pipeline/qqmusic/p-64a01972b8684e85a70a415dbb014dd6/history"
            },
            wetest: {
                device_choose_type: 0,
                device_num: 10,
            }
        },
        proxyContent: null,
        caseList: [
            {
                Fcase_id: '014db351-0eb8-4bff-88da-689beaa6849f',
                Fcase_status: 'INIT',
                Fevent_result: [],
                account: {
                    Faccount_id: 'b2266428-ad51-489d-a693-bb2891596300',
                    uin: '3304864593',
                    password: '6876e3dddd2c99eab9b25f1c2f6f4fce',
                    Fvi: 'jwp1659685023623',
                },
                env: 'QQMusic',
                eventList: [
                    {
                        delay: '2000',
                        eventDom: '//*[@id="ssh_root"]/div/div[2]/div/section[2]/nav/a[4]',
                        eventType: 'tap',
                        eventCheck: {
                            expectation: {
                                jscode: "document.querySelector('.mui_list__info_price') &amp;&amp; getComputedStyle(document.querySelector('.mui_list__info_price'))['display'] === 'block'",
                            },
                            eventCheckType: 4,
                        },
                    },
                ],
                eventName: '子tab切换至商城',
                eventIndex: 0,
                Fcreate_time: '2022-09-21T07:18:29.175Z',
                Fupdate_time: '2022-09-21T07:56:36.000Z',
                Fcase_history_id: 'a4e050d8-e416-4c79-abd2-ebfd30ea92c7',
            },
            {
                Fcase_id: '117c26e2-a84f-4a8a-b078-077909a7be51',
                Fcase_status: 'INIT',
                Fevent_result: [],
                account: {
                    Faccount_id: 'b2266428-ad51-489d-a693-bb2891596300',
                    uin: '3304864593',
                    password: '6876e3dddd2c99eab9b25f1c2f6f4fce',
                    Fvi: 'jwp1659685023623',
                },
                env: 'QQMusic',
                eventList: [
                    {
                        delay: '2000',
                        eventDom: '//*[@id="ssh_root"]/div/div[2]/div/section[2]/nav/a[4]',
                        eventType: 'click',
                        eventCheck: {
                            expectation: {
                                link: 'https://y.qq.com/n2/m/vipgrowup/index.html?entry=1&amp;_hidehd=1&amp;_hdct=2&amp;ADTAG=vipcenterv9',
                                jumpWays: 1,
                            },
                            eventCheckType: 2,
                        },
                    },
                ],
                eventName: '会员信息滚动条点击跳转',
                eventIndex: 1,
                Fcreate_time: '2022-09-21T03:53:14.155Z',
                Fupdate_time: '2022-09-22T07:14:11.000Z',
                Fcase_history_id: 'e1609e66-dddf-4608-a3cf-ed2eb89acd75',
            },
        ],
    },
};
//# sourceMappingURL=mock.js.map