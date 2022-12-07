// 测试RunnerScreenshot 定时截图比较前后图片相似度
const RunnerScreenshot = require('../es/monitor/runners/runner-screenshot');


test('test run runner-lhreport with an error 定时截图比较前后图片相似度', async () => {
    const runnerScreenshot = new RunnerScreenshot.default();
    expect.assertions(1);
    try {
        await runnerScreenshot.run();
    } catch (error) {
        expect(error).toBeDefined();
    }
})

test('test run runner-lhreport 定时截图比较前后图片相似度', async () => {
    const Browser = require('../es/monitor/browser');
    const browser = await Browser.default.initBrowser();
    const runnerScreenshot = new RunnerScreenshot.default();
    const res = await runnerScreenshot.run({
        item: {
            page_id: 17,
            title: '会员中心',
            url: 'https://i.y.qq.com/n2/m/myvip/v9/index.html?_hidehd=1&_hdct=2&_miniplayer=1',
            toPerson: 'shiningding',
            ssimThreshold: 0.7,
        },
        browser,
    });
    expect(res.isWhite).toBeDefined();
    expect(res.errorFileList).toBeDefined();
    expect(res.errorMessageList).toBeDefined();
})