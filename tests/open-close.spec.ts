import { test, expect } from "@playwright/test";
import { PlaywrightDevPage } from "./page-object";

test("open and close dev tools", async ({ page }) => {
  const po = new PlaywrightDevPage(page);
  await po.goto();

  await po.collapsedButton.click();
  await expect(po.devToolsContainer).toBeVisible();

  await po.closeButton.click();
  await expect(po.devToolsContainer).not.toBeVisible();
});
