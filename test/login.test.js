// 测试login 页面登录
const { login, loginFromChromeLauncher } = require('../es/monitor/login');
const puppeteer = require('puppeteer-core');

test('test run login 页面登录', async() => {
    const browser = await puppeteer.launch();
    const res = await login(browser);
    expect(res).toBeNull();
})

test('test run login with an error 页面登录', async() => {
    const browser = await puppeteer.launch();
    expect.assertions(1);
    try {
        await login();
    } catch (error) {
        expect(error).toBe(2);
    }
})

test('test run loginFromChromeLauncher ', async() => {
    const res = await loginFromChromeLauncher();
    expect(res).toBeNull();
})
