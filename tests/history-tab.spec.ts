import { test, expect } from "@playwright/test";
import { PlaywrightDevPage } from "./page-object";

test("create and revert history items", async ({ page }) => {
  const po = new PlaywrightDevPage(page);
  await po.goto();
  await po.collapsedButton.click();
  await expect(po.devToolsContainer).toBeVisible();
  const messages: Array<string> = [];
  page.on("pageerror", (error) => {
    messages.push(`[${error.name}] ${error.message}`);
  });

  await po.tabHistoryButton.click();
  await expect(po.locateTab("history")).toBeVisible();

  expect(await po.listItemActive.count()).toBe(1);

  await po.proseMirror.type("H", { delay: 200 });
  await po.proseMirror.type("e", { delay: 200 });
  await po.proseMirror.type("l", { delay: 200 });
  await po.proseMirror.type("l", { delay: 200 });
  await po.proseMirror.type("o", { delay: 200 });
  expect(await po.listItemActive.count()).toBeGreaterThan(5);
  await expect(po.proseMirror).toHaveText("Hello");

  // Reset to N=2 = check that not equal to Hello
  let count = await po.listItemActive.count();
  await po.listItemActive.nth(count - 2).dblclick();
  await expect(po.proseMirror).not.toHaveText("Hello");
  expect(await po.listItemInactive.count()).toBeGreaterThan(0);

  // Reset to N=0 = check that equal to Hello
  await po.listItemInactive.nth(0).dblclick();
  await expect(po.proseMirror).toHaveText("Hello");
  expect(await po.listItemInactive.count()).toBe(0);

  // Type more text check that number of items is more than 5 and text Hello World
  await po.proseMirror.type("W");
  expect(await po.listItemActive.count()).toBeGreaterThanOrEqual(6);
  await expect(po.proseMirror).toHaveText("HelloW");

  // Reset to N=2 check that number of items is less than 5 and text not Hello World
  count = await po.listItemActive.count();
  await po.listItemActive.nth(count - 2).dblclick();
  await expect(po.proseMirror).not.toHaveText("HelloW");
  expect(await po.listItemInactive.count()).toBeGreaterThan(0);

  // Type and check if number of active items is less than 5
  await po.proseMirror.type("o");
  expect(await po.listItemActive.count()).toBeLessThan(5);

  // Reset to N=0 check that text is empty
  count = await po.listItemActive.count();
  await po.listItemActive.nth(count - 1).dblclick();
  await expect(po.proseMirror).toHaveText("");

  expect(messages).toStrictEqual([]);
});
