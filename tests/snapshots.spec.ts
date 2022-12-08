import { test, expect } from "@playwright/test";
import { PlaywrightDevPage } from "./page-object";

test("save and restore snaphsots", async ({ page }) => {
  const po = new PlaywrightDevPage(page);
  await po.goto();
  await po.collapsedButton.click();
  await expect(po.devToolsContainer).toBeVisible();

  await page.evaluate(() => window.localStorage.clear());
  page.on("dialog", async (dialog) => {
    await dialog.accept("" + Math.ceil(Math.random() * 10000));
  });

  await po.tabSnapshotsButton.click();
  await expect(po.locateTab("snapshots")).toBeVisible();

  await po.saveSnapshotButton.click();

  await po.proseMirror.type("Hello");
  await po.proseMirror.press("Enter");
  await po.proseMirror.type("World");

  await po.saveSnapshotButton.click();

  await po.page.getByText("restore", { exact: true }).nth(1).click();
  await expect(po.proseMirror).toHaveText("");

  await po.proseMirror.type("Some other");
  await po.proseMirror.press("Enter");
  await po.proseMirror.type("Text");

  await po.page.getByText("restore", { exact: true }).nth(0).click();
  await expect(po.proseMirror).toHaveText("HelloWorld");
});

test("delete snaphsots", async ({ page }) => {
  const po = new PlaywrightDevPage(page);
  await po.goto();
  await po.collapsedButton.click();
  await expect(po.devToolsContainer).toBeVisible();

  await page.evaluate(() => window.localStorage.clear());
  page.on("dialog", async (dialog) => {
    await dialog.accept("" + Math.ceil(Math.random() * 10000));
  });

  await po.tabSnapshotsButton.click();
  await expect(po.locateTab("snapshots")).toBeVisible();

  await po.saveSnapshotButton.click();

  await po.proseMirror.type("Hello");
  await po.proseMirror.press("Enter");
  await po.proseMirror.type("World");

  await po.saveSnapshotButton.click();
  expect(await po.page.getByText("delete", { exact: true }).count()).toBe(2);

  await po.page.getByText("delete", { exact: true }).nth(1).click();
  expect(await po.page.getByText("delete", { exact: true }).count()).toBe(1);
});
