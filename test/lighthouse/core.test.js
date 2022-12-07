// 测试core 主逻辑生成性能报告
const Core = require('../../es/lighthouse/core');
jest.mock('opn', () => {
    return () => void 0;
})
test('test run core 主逻辑生成性能报告', () => {
    
    const core = Core.default;
    return core({
        url: 'https://i.y.qq.com/n2/m/myvip/v9/index.html?_hidehd=1&_hdct=2&_miniplayer=1',
        target: 'html',
        flags: [],
    }).then(res => {
        expect(res).toBeUndefined();
    })
});