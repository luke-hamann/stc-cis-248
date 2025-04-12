import { assertEquals } from "https://deno.land/std@0.104.0/testing/asserts.ts";
import getBrowser from "../getBrowser.ts";

const SERVER = "http://localhost:8000/";

Deno.test({
  name: "Add and Delete Team Member",
  permissions: { env: true, read: true, write: true, run: true, net: true },
  fn: async () => {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto(`${SERVER}team-members/`);
    await page.click('[href="/team-members/add/"]');
    await page.waitForNetworkIdle();

    const firstName = crypto.randomUUID();
    const lastName = crypto.randomUUID();

    await page.type("#firstName", firstName);
    await page.type("#lastName", lastName);
    await page.type("#birthDate", "12311999");
    await page.click("[type=submit]");
    await page.waitForNetworkIdle();

    const h1 = await page.waitForSelector("h1");
    const heading = await h1?.evaluate((element) => element.textContent);

    assertEquals(heading, `${firstName} ${lastName}`);

    await page.click('[href$="/delete/"]');
    await page.waitForNetworkIdle();

    await page.click('[type="submit"]');
    await page.waitForNetworkIdle();

    const div = await page.$(
      `::-p-xpath(//div[contains(text(), '${firstName} ${lastName}')])`,
    );

    assertEquals(div, null);

    await page.close();
    await browser.close();
  },
});
