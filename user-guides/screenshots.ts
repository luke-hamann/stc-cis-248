import puppeteer from "npm:puppeteer";
import screenshots from "./screenshots.json" with { type: "json" };

const targets = screenshots as [string, number, number, string][];

const baseUrl = "http://localhost:8000/";

const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const page = await browser.newPage();
for (const target of targets) {
  await page.setViewport({ width: target[1], height: target[2] });
  await page.goto(baseUrl + target[0]);
  const path = `./user-guides/src/images/${target[3]}.png`;
  await page.screenshot({ path });
  console.log(path);
}
await browser.close();
