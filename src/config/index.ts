import { platform } from 'os';
import * as path from 'path'
export const IS_MACOS = platform() === 'darwin';
const env = path.join(__dirname, '../../',(IS_MACOS ? '.env.shining' : '.env'));
console.log('env', env)
require('dotenv').config({ path: env })
console.log('process.env', process.env.CHROME_PATH)
export const CHROME_PATH = process.env.CHROME_PATH
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
