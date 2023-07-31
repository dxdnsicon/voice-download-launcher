import { platform } from 'os';
import * as fs from 'fs';
import * as path from 'path'
import { exec } from 'child_process';
export const IS_MACOS = platform() === 'darwin';
const env = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: env })

export const CHROME_PATH = process.env.CHROME_PATH;

export async function getChromeInstallPath(): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = process.platform === 'win32' ? 'where chrome' : 'which google-chrome';
    exec(command, (err, stdout) => {
      if (!err) {
        const chromePath = stdout.trim();
        resolve(chromePath);
      } else {
        console.error('获取 Chrome 安装路径失败：使用默认安装Chrome路径:', CHROME_PATH);
        resolve(CHROME_PATH);
      }
    });
  })
}


console.log('env', env)

export const DIST_DIR = path.resolve(process.cwd()) + '/dist/';
console.log('DIST_DIR', DIST_DIR)

// 初始化目录(首次部署的时候可以自动创建配置中的目录，避免目录找不到)
export const initPath = (path) => {
  fs.exists(path, async (exists) => {
    if (!exists) {
      fs.mkdirSync(path);
    }
  });
};

initPath(DIST_DIR);

export const CHROME_FLAGS = [
  ...(IS_MACOS ? [] : ["--headless"]),
  "--no-sandbox",
  "--disable-gpu",
  '--disable-dev-shm-usage', //See https://github.com/GoogleChrome/lighthouse/issues/6512#issuecomment-925185412
  '--ignoreHTTPSErrors=true',
  '--ignore-certifcate-errors',
  '--ignore-certifcate-errors-spki-list',
  '--disable-infobars',
  '--no-first-run', // 关闭默认打开的设置首页
  '--disable-setuid-sandbox',

  // whistle proxy
  // https://github.com/puppeteer/puppeteer/issues/2377
  '--ignore-certificate-errors',

  //  See https://github.com/puppeteer/puppeteer/issues/1825#issuecomment-636478077
  // "--single-process",
  // '--no-zygote',
  
  // '--force-fieldtrials=*BackgroundTracing/default/',  // see https://github.com/GoogleChrome/lighthouse/issues/1091
  // `--remote-debugging-port=0`,
  // ...(USE_PROXY ? [`--proxy-server=${PROXY_STR}`] : [])
]
