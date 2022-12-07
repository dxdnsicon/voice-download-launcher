// 测试RunnerLhreport 生成性能报告
const RunnerLhreport = require('../es/monitor/runners/runner-lhreport');

test('test run runner-lhreport with an error 生成性能报告', async () => {
    const runnerLhreport = new RunnerLhreport.default();
    expect.assertions(1);
    try {
        await runnerLhreport.run();
    } catch (error) {
        expect(error).toBeDefined();
    }
})

test('test run runner-lhreport 生成性能报告', async () => {
    const runnerLhreport = new RunnerLhreport.default();
    const res = await runnerLhreport.run({
        item: {
            page_id: 17,
            title: '会员中心',
            url: 'https://i.y.qq.com/n2/m/myvip/v9/index.html?_hidehd=1&_hdct=2&_miniplayer=1',
            toPerson: 'shiningding',
            ssimThreshold: 0.7,
        },
        map: {},
        resultMap: {}
    });
    expect(res.code).toBe(0);
})


test('test run runner-lhreport 直出获取md5', async () => {
    const runnerLhreport = new RunnerLhreport.default();

    const res = await runnerLhreport.getMd5FromUrl({
        page_id: 17,
        title: '会员中心',
        url: 'https://i.y.qq.com/n2/m/myvip/v9/index.html?_hidehd=1&_hdct=2&_miniplayer=1',
        toPerson: 'shiningding',
        ssimThreshold: 0.7,
    }, 3);
    expect(res).toBe('aa7283fb');
})

test('test run runner-lhreport 非直出获取md5', async () => {
    const runnerLhreport = new RunnerLhreport.default();
    const res = await runnerLhreport.getMd5FromUrl({
        page_id: 17,
        title: '会员中心',
        url: 'https://y.qq.com/n2/m/myvip/v9/index.html?_hidehd=1&_hdct=2&_miniplayer=1',
        toPerson: 'shiningding',
        ssimThreshold: 0.7,
    }, 0);
    expect(res).toBe('src=\"https://y.qq.com/n2/m/myvip/v9/js/index.aa7283fb.js?max_age=6048000\"');
})

test('test run runner-lhreport with an error 生成性能报告', async () => {
    const runnerLhreport = new RunnerLhreport.default();
    expect.assertions(1);
    try {
        await runnerLhreport.getMd5FromUrl();
    } catch (error) {
        expect(error).toBeDefined();
    }
})

test('test run startLighthouse 子进程触发lighthouse任务', () => {
    const startLighthouse = RunnerLhreport.startLighthouse;
    expect(startLighthouse('https://y.qq.com/n2/m/myvip/v9/index.html?_hidehd=1&_hdct=2&_miniplayer=1')).toBeDefined()
})

test('test run startLighthouse with no args 子进程触发lighthouse任务', () => {
    const startLighthouse = RunnerLhreport.startLighthouse;
    expect(startLighthouse()).resolves.toBeNull()
})