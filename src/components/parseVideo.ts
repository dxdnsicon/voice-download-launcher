// 解析出视频
import { exec } from 'child_process';
import { initBrowser, closeBrowser } from './browser'; 
import { DIST_DIR } from '../config';
import Installer from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { ProcessRsp, ProcessState } from '../typings/task';
const ffmpegPath = Installer.path;
ffmpeg.setFfmpegPath(ffmpegPath);

const getVideoUrl = async (pageUrl): Promise<{
  url: string;
  name: string;
  headers: Record<string, string>;
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
    let mp4Headers = null;
    page.on('request', async (req) => {
      const assets = req.url();
      if (assets.indexOf('.mp4?') > -1) {
        mp4Headers = req.headers();
      }
    })
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
    console.log('mp4Headers', mp4Headers)
    await close();
    resolve({
      url: videoUrl,
      name: title,
      headers: mp4Headers
    })
  })
}

const makeHeaders = (headers: Record<string, string>): string => {
  let str = ''
  for (let i in headers) {
    str += `--header='${i}:${headers[i]}' `
  }
  return str;
}

const downLoadHandle = (url: string, fileName: string, headers: Record<string, string>): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filePath = `${DIST_DIR}${fileName}.mp4`
    const cmd = `
    wget '${url}' -O '${filePath}' --no-check-certificate --debug --header='sec-ch-ua:' --header='referer:https://www.tangdoufdn.com/'  
    `
    console.log('cmd', cmd)
    exec(cmd, (err, stdout, stderr) => {
      console.log('stdout', stdout, stderr)
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

const cdnUrl = (name: string) => {
  return `/static/dist/${name}.mp3`
}

export default async function (pageUrl: string, cb?: (process: ProcessRsp) => void) {
  try {
    cb?.({
      name: ProcessState.OPENWEB,
      data: { url: pageUrl }
    })
    const { url, name, headers } = await getVideoUrl(pageUrl);
    cb?.({
      name: ProcessState.DOWNLOAD,
      data: { url, name, headers }
    })
    console.log('davideoUrlta', url, name)
    const filePath = await downLoadHandle(url, name, headers);
    cb?.({
      name: ProcessState.FORMAT,
      data: {
        filePath: cdnUrl(name),
        fileName: name
      }
    })
    const mp3File = await mp4Tomp3(filePath, name);
    cb?.({
      name: ProcessState.END,
      data: {
        filePath: cdnUrl(name),
        fileName: `${name}.mp3`
      }
    })
    console.log('转换完成', mp3File)
    return {
      filePath: cdnUrl(name),
      fileName: name
    }
  } catch(e) {
    console.error(e);
  }
}