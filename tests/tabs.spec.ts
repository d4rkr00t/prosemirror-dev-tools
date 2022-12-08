import { test, expect } from "@playwright/test";
import { PlaywrightDevPage } from "./page-object";

test("switch tabs", async ({ page }) => {
  const po = new PlaywrightDevPage(page);
  await po.goto();
  await po.collapsedButton.click();
  await expect(po.devToolsContainer).toBeVisible();

  await po.tabHistoryButton.click();
  await expect(po.locateTab("history")).toBeVisible();

  await po.tabPluginsButton.click();
  await expect(po.locateTab("plugins")).toBeVisible();

  await po.tabSchemaButton.click();
  await expect(po.locateTab("schema")).toBeVisible();

  await po.tabSnapshotsButton.click();
  await expect(po.locateTab("snapshots")).toBeVisible();

  await po.tabStructureButton.click();
  await expect(po.locateTab("structure")).toBeVisible();

  await po.tabStateButton.click();
  await expect(po.locateTab("state")).toBeVisible();
});
