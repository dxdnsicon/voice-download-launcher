// 测试result 读写页面的mdmap
const Result = require('../es/monitor/result');

test('test run result rootName 属性访问', async () => {
  const newResult = new Result.default();
  expect(newResult.rootName).toMatch(/\/cache\/lhcache(_)?(test|stage)?.json/);
});

test('test run result setResult执行与返回', async () => {
  const newResult = new Result.default();
  const setResultRes = await newResult.setResult();
  await newResult.setResult('newResult.setResult');
  expect(setResultRes).toBeUndefined();
});

test('test run result getResultRes执行与返回', async () => {
  const newResult = new Result.default();
  const getResultRes = await newResult.getResult();
  expect(getResultRes).toMatch(/newResult.setResult/);
});