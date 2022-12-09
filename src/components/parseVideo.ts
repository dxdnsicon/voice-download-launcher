// 解析出视频
import { exec } from 'child_process';
import { initBrowser, closeBrowser } from './browser'; 
import { DIST_DIR } from '../config';

const getVideoUrl = async (): Promise<{
  url: string;
  name: string;
}> => {
  const url = 'https://www.tangdoucdn.com/h5/play?vid=20000003077908&p_source=lightapp&diu=6f446ccb6e8c9d7598d8a3e7f566b614804ac7a045235cf8976af77f7386e3ab&platform=huawei&p_orgin_source='
  let over = false;
  let title = '';
  let videoUrl = '';
  return new Promise(async (resolve, reject) => {
    const browser  = await initBrowser();
    const page = await browser.newPage();
    const close = async () => {
      await page.close();
      await closeBrowser(browser);
    }
    setTimeout(async () => {
      // 10s超时
      if (!over) {
        await close();
        reject()
      }
    },15000)
    page.on('response', async (res) => {
      const assets = res.url();
      if (assets.indexOf('.mp4?') > -1) {
        over = true;
        videoUrl = assets;
      }
    })
    await page.goto(url);
    await page.waitForTimeout(3000);
    title = await page.evaluate(() => document.querySelector("#app > div > div:nth-child(2) > div.user-bar > div.info > p.title").textContent);
    await close();
    resolve({
      url: videoUrl,
      name: title
    })
  })
}

const downLoadHandle = (url: string, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cmd = `
    wget '${url}' -O '${DIST_DIR}${fileName}.mp4' --debug --header="host: aqiniushare.tangdou.com" --header="sec-fetch-site:cross-site" --header="sec-fetch-mode:no-cors" --header="sec-fetch-dest:video" --header="referer:https://www.tangdoucdn.com/" --header="accept-language:zh-CN,zh;q=0.9" --header="range:bytes=851108-69482961" --header="if-range:lkGfxRPMOxwEKiPhfFVlVW3m_zb7"
    `
    exec(cmd, (err, stdout, stderr) => {
      if (!err) {
        console.log('download err', err)
        reject(err);
      }
      else if (!stderr) {
        console.log('download err', stderr)
        reject(stderr);
      }
      else {
        resolve(stdout);
      }
    });
  })
}

export default async function () {
  const { url, name } = await getVideoUrl();
  console.log('davideoUrlta', url, name)
  await downLoadHandle(url, name)
  process.exit(0)
}