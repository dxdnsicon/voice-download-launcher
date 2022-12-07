// 测试browser 告警处理逻辑
const ActionNotice = require('../es/monitor/actions/action-notice');

test('test run action-notice with an error 告警处理逻辑', async () => {
    const actionEngine = new ActionNotice.default();
    expect.assertions(1);
    try {
        await actionEngine.run();
    } catch (error) {
        expect(error).toBeDefined();
    }
})

test('test run action-notice 告警处理逻辑', () => {
    const actionEngine = new ActionNotice.default();
    return actionEngine.run({
        page_id: 17,
        title: '会员中心',
        url: 'https://i.y.qq.com/n2/m/myvip/v9/index.html?_hidehd=1&_hdct=2&_miniplayer=1',
        toPerson: 'shiningding',
        ssimThreshold: 0.7,
    }, {
        'runner-lhreport': {
            code: 0
        },
        'runner-screenshot': {
            isWhite: false,
            errorFileList: [],
            errorMessageList: []
        },
    });
})