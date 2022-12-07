/*
 * @Author: shiningding <shiningding@tencent.com>
 * @Date: 2022-02-18 10:26:09
 * @--------------------------------------------------: 
 * @LastEditTime: 2022-02-18 11:34:34
 * @Modified By: shiningding <shiningding@tencent.com>
 * @---------------------------------------------------: 
 * @Description: 模块mock
 */
jest.mock('child_process', () => {
  return {
    fork() {
      return {
        send() {},
        on() {},
      };
    },
    exec(cmd, cb) {
      cb && cb('', 'src="https://y.qq.com/n2/m/myvip/v9/js/index.aa7283fb.js?max_age=6048000"');
      return true;
    }
  };
});

jest.mock('puppeteer-core', () => {
  return {
    devices: {
      'iPhone X': {
        name: 'iPhone X',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
          width: 375,
          height: 812,
          deviceScaleFactor: 3,
          isMobile: true,
          hasTouch: true,
          isLandscape: false,
        },
      },
    },
    async launch() {
      return {
        async newPage() {
          console.log('创建一个新页面')
          return {
            on(name, cb){
              // cb && cb();
            },
            async screenshot(options){
              console.log('截屏')
            },
            async setCookie() {
              console.log('设置cookie')
            },
            async emulate(options) {
              console.log('设置模拟的设备指标和用户代理')
            },
            setDefaultTimeout(timeout) {
              console.log('设置默认超时时间')
            },
            async goto(url, options) {
              console.log('前往页面')
            },
            async setViewport(viewport) {
              console.log('设置viewport')
            },
            async type(selector, text, options) {
              console.log('找到对应元素并设置输入值')
            },
            async waitForTimeout(milliseconds) {
              console.log('暂停给定时间')
            },
            async evaluate(pageFunction) {
              console.log('在页面实例上下文中执行的方法')
            },
            async waitForNavigation(options) {
              console.log('等待页面跳转成功');
            },
            async cookies(urls) {
              console.log('获取cookie');
              return null
            },
          }
        },
        async close(){}
      };
    },
    exec() {
      return true;
    }
  };
});

jest.mock('chrome-launcher', () => {
  return {
    async launch(options) {
      return {
        port: 80,
        async kill(){}
      }
    }
  }
})

jest.mock('fs', () => {
  return {
    fileMap: {},
    exists(dir, cd){
      return true;
    },
    readFileSync(dir, charset){
      return this.fileMap[dir]
    },
    writeFileSync(dir, content){
      return this.fileMap[dir] = content
    },
  }
});

const axiosMock = jest.fn();
jest.mock('../../es/utils/axios', () => {
  return axiosMock.mockResolvedValue({ code: 0 });
})

// jest.mock ('../../es/monitor/result', () => {
//   let localMap = {}
//   class Result {
//     rootName = '';
//     constructor () {}
//     async getResult () {
//       return new Promise (resolve => {
//         resolve(localMap)
//       });
//     }

//     async setResult (map) {
//       if (!map) return;
//       localMap = map;
//     }
//   }
//   return Result
// });