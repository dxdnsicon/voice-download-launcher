// 测试check巡查任务
const Task = require ('../es/monitor/task');
jest.useFakeTimers();
test('test run task 测试巡查任务', async () => {
  try {
    Task.default ([
        {
        page_id: 17,
        title: '会员中心',
        url: 'https://i.y.qq.com/n2/m/myvip/v9/index.html?_hidehd=1&_hdct=2&_miniplayer=1',
        toPerson: 'shiningding',
        ssimThreshold: 0.7,
        },
    ], {})
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  } catch (error) {
    expect(error).toBeDefined();
  }
});
