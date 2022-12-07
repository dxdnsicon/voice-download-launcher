// 测试task 轮训任务
const Dispatch = require('../es/monitor/dispatch');

test('test run task 测试轮训任务', async () => {
    const newDispatch = await Dispatch.default();
    expect(newDispatch).toBeUndefined();   
});
