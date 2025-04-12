import puppeteer from "npm:puppeteer";

const options = {
  headless: false,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
};

export default async function getBrowser() {
  return await puppeteer.launch(options);
}
