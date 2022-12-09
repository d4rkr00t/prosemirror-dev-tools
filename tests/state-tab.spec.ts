import { test, expect } from "@playwright/test";
import { PlaywrightDevPage } from "./page-object";

test("log nodes from the current doc tree", async ({ page }) => {
  const po = new PlaywrightDevPage(page);
  await po.goto();
  await po.collapsedButton.click();
  await expect(po.devToolsContainer).toBeVisible();

  await po.tabStateButton.click();
  await expect(po.locateTab("state")).toBeVisible();

  await po.proseMirror.type("Hello");
  await po.proseMirror.press("Enter");
  await po.proseMirror.type("World");
  await expect(po.proseMirror).toHaveText("HelloWorld");

  await po.page.locator("label").getByText("content").click();

  const messages: Array<string> = [];
  page.on("pageerror", (error) => {
    messages.push(`[${error.name}] ${error.message}`);
  });

  await po.stateLogNodeButtons.nth(2).click();
  expect(messages).toStrictEqual([]);
});
