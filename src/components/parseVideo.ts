// 解析出视频
import { initBrowser, closeBrowser } from './browser'; 

const getVideoUrl = async (): Promise<string> => {
  const url = 'https://www.tangdoucdn.com/h5/play?vid=20000003077908&p_source=lightapp&diu=6f446ccb6e8c9d7598d8a3e7f566b614804ac7a045235cf8976af77f7386e3ab&platform=huawei&p_orgin_source='
  return new Promise(async (resolve) => {
    const browser  = await initBrowser();
    const page = await browser.newPage();
    const close = async () => {
      await page.close();
      await closeBrowser(browser);
    }
    page.on('response', async (res) => {
      const assets = res.url();
      if (assets.indexOf('.mp4?') > -1) {
        resolve(assets);
        await close();
      }
    })
    await page.goto(url);
    setTimeout(async () => {
      // 10s超时
      resolve('')
      await close();
    },10000)
  })
}

export default async function () {
  const videoUrl = await getVideoUrl();
  console.log('davideoUrlta', videoUrl)
  process.exit(0)
}