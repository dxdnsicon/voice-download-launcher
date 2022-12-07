// 测试Opsvr
const Opsvr = require('../../es/lighthouse/opsvr');

test('test run opsvr', () => {
    expect(Opsvr.default()).toBeUndefined();
})