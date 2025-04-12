import { assert } from "node:console";
import getBrowser from "../getBrowser.ts";

const SERVER = "http://localhost:8000/";

function formatDateAsPath(originalDate: Date) {
  const year = originalDate.getFullYear().toString().padStart(4, "0");
  const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
  const date = originalDate.getDate().toString().padStart(2, "0");

  return `${year}/${month}/${date}`;
}

Deno.test({
  name: "GET / redirects to current year",
  permissions: { net: true },
  fn: async () => {
    const response = await fetch(SERVER);
    assert(response.status == 302);
    assert(response.redirected);
    assert(
      response.headers.get("location") ==
        `/schedule/${new Date().getFullYear()}`,
    );
    await response.body?.cancel();
  },
});

Deno.test({
  name: "GET /schedule/yyyy/ current year highlights current date",
  permissions: { env: true, read: true, write: true, run: true, net: true },
  fn: async () => {
    const currentDate = new Date();
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(`${SERVER}schedule/${currentDate.getFullYear()}/`);
    await page.waitForNetworkIdle();
    const result = await page.evaluate(`
      document.querySelector('[href="/schedule/${
      formatDateAsPath(currentDate)
    }/"]').style['background-color']
    `);
    assert(result != undefined);
    await page.close();
    await browser.close();
  },
});
