const puppeteer = require('puppeteer');
require("dotenv").config();
const user = process.env.PHONE;
const pass = process.env.PASS;
const thread = process.env.THREAD;

const escapeXpathString = str => {
    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`;
  };
const clickByText = async (page, text) => {
    const escapedText = escapeXpathString(text);
    const linkHandlers = await page.$x(`//span[contains(text(), ${escapedText})]`);
    
    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      throw new Error(`Link not found: ${text}`);
    }
  };
const themes = [18,12,24,26,0,22];

const themeLoop = async(page) => {
  await page.waitForTimeout(1000);
  await clickByText(page, `Change Theme`);
  let i = 0;
  while(true){
    await page.waitForSelector('div.rf5wgz6l>div>div.rj1gh0hx');
    let element = await page.$$('div.rf5wgz6l>div>div.rj1gh0hx');
    element[themes[i++]].click();
    await page.waitForTimeout(200);
    await page.click(`[href="/t/${thread}/"]`);
    await page.waitForTimeout(200);
    await clickByText(page, `Change Theme`);
    if (i>5) i = 0;
  }

}
(async () => {
    const browser = await puppeteer.launch({
       // headless: false,
    });
    const page = await browser.newPage();
    try {
        await page.goto('http://www.messenger.com/login/');
        await page.waitForTimeout(1000)
        await page.click('input#email');
        await page.keyboard.type(user);
        await page.click('input[name="pass"]')
        await page.keyboard.type(pass);
        await page.click('button[name="login"]');
    } catch (error) {
        
    }
    await page.waitForNavigation();
    await page.waitForSelector(`[href="/t/${thread}/"]`);
    await page.click(`[href="/t/${thread}/"]`);
    await clickByText(page, `Customize Chat`);
    await themeLoop(page);

    //await browser.close();
})();