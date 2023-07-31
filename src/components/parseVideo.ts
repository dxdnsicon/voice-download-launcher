// 解析出视频
import { exec } from 'child_process';
import { initBrowser, closeBrowser } from './browser'; 
import { DIST_DIR } from '../config';
import Installer from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
const ffmpegPath = Installer.path;
ffmpeg.setFfmpegPath(ffmpegPath);

const getVideoUrl = async (pageUrl): Promise<{
  url: string;
  name: string;
}> => {
  const url = pageUrl || 'https://share.tangdouadn.com/h5/play?vid=20000002722749&utm_campaign=client_share&utm_source=tangdou_android&utm_medium=wx_chat&utm_type=0&share_uid=8602602'
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
    const filePath = `${DIST_DIR}${fileName}.mp4`
    const cmd = `
    wget '${url}' -O '${filePath}' --debug --header="host: aqiniushare.tangdou.com" --header="sec-fetch-site:cross-site" --header="sec-fetch-mode:no-cors" --header="sec-fetch-dest:video" --header="referer:https://www.tangdoucdn.com/" --header="accept-language:zh-CN,zh;q=0.9" --header="range:bytes=851108-69482961" --header="if-range:lkGfxRPMOxwEKiPhfFVlVW3m_zb7"
    `
    console.log('cmd', cmd)
    exec(cmd, (err, stdout, stderr) => {
      if (!!err) {
        console.log('download err', err)
        reject(err);
      } else {
        console.log('download success!!!!!!')
        resolve(filePath);
      }
    });
  })
}

// 将视频转换成音频
const mp4Tomp3 = (filePath: string, fileName: string) => {
  return new Promise((resolve, reject) => {
    const audioName = `${DIST_DIR}${fileName}.mp3`;
    const commend = new ffmpeg(filePath);
    console.log('data', commend.output)
    commend.on('start', (str) => {console.log('start', str)})
           .on('progress', (progress) => { console.log('ing', progress?.targetSize)})
           .on('end', (str) => {
            console.log('over')
            resolve(audioName)
           })
           .save(audioName);
  })
}

export default async function (pageUrl: string) {
  try {
    const { url, name } = await getVideoUrl(pageUrl);
    console.log('davideoUrlta', url, name)
    const filePath = await downLoadHandle(url, name);
    const mp3File = await mp4Tomp3(filePath, name);
    console.log('转换完成', mp3File)
    process.exit(0)
  } catch(e) {
    console.error(e);
  }
}