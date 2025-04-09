import puppeteer from "npm:puppeteer";
import screenshots from "./screenshots.json" with { type: "json" };

const targets = screenshots as [string, number, number, string][];

const baseUrl = "http://localhost:8000/";
const screenshotPath = "./user-guides/src/images/";

const options = { headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" };

const browser = await puppeteer.launch(options);
const page = await browser.newPage();

// Regular screenshots

for (const target of targets) {
  await page.setViewport({ width: target[1], height: target[2] });
  await page.goto(baseUrl + target[0], { waitUntil: "networkidle2" });
  const path = `${screenshotPath}${target[3]}.png`;
  await page.screenshot({ path });
  console.log(path);
}

// Copy preview

await page.setViewport({ width: 500, height: 700 });
await page.goto(baseUrl + "schedule/copy/from/2025/03/02/through/2025/03/08/");
await page.type("#toStartDate", "03092025");
await page.type("#toEndDate", "03152025");
await page.click("[type=submit]");
await page.waitForNetworkIdle();
let path = `${screenshotPath}schedule_copy_preview.png`;
await page.screenshot({ path });
console.log(path);

// Schedule week view

await page.setViewport({ width: 1400, height: 1230 });
await page.goto(baseUrl + "schedule/2025/03/02/");
await page.$$eval("summary", handlers => handlers.forEach(element => element.click()));
path =  `${screenshotPath}schedule_week_table.png`;
await page.screenshot({ path });
console.log(path);

// Close browser

await browser.close();
