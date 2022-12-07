// 测试browser 浏览器任务
const Browser = require('../es/monitor/browser');

test('test run browser 执行initBrowser', async () => {
    const browser = Browser.default;
    const newBrowser = await browser.initBrowser();
    expect(newBrowser).toHaveProperty('newPage');
    expect(newBrowser).toHaveProperty('close');
});

test('test run browser 执行closeBrowser', async () => {
    const browser = Browser.default;
    const res = await browser.closeBrowser();
    expect(res).toBeUndefined();
});