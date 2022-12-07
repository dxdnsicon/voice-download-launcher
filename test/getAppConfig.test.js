// 测试task 获取页面配置
const GetAppConfig = require('../es/monitor/getAppConfig');

test('test run getAppConfig 获取页面配置', async () => {
    const res = await GetAppConfig.default();
    expect(res).toBeDefined();   
});