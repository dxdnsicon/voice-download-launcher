/*
 * @Author: shiningding <shiningding@tencent.com>
 * @Date: 2021-05-06 17:21:00
 * @--------------------------------------------------: 
 * @LastEditTime: 2023-07-31 10:38:03
 * @Modified By: shiningding <shiningding@tencent.com>
 * @---------------------------------------------------: 
 * @Description: 处理browser
 */
import puppeteer from 'puppeteer-core';
import { CHROME_FLAGS, getChromeInstallPath } from '../config/index';

export const initBrowser = async (flags: string[] = []) => {
  try {

    const CHromePath = await getChromeInstallPath();
    const config = {
      args: [
        ...CHROME_FLAGS,
        ...flags,
        // '--user-agent= Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
      ],
      executablePath: CHromePath,
      ignoreHTTPSErrors: true,
      headless: false,
      isMobile: true
    }

    console.log('CHromePath', CHromePath)
    const browser = await puppeteer.launch(config);
    return browser;
  } catch (e) {
    console.error('init browser error', e);
    throw e
  }
}

export const closeBrowser = async (browser) => {
  if (browser) {
    await browser.close();
  }
}