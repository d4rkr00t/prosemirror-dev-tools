import { Locator, Page } from "@playwright/test";

export class PlaywrightDevPage {
  readonly page: Page;
  readonly collapsedButton: Locator;
  readonly devToolsContainer: Locator;
  readonly closeButton: Locator;

  readonly tabStateButton: Locator;
  readonly tabButtonsConatiner: Locator;
  readonly tabHistoryButton: Locator;
  readonly tabPluginsButton: Locator;
  readonly tabSchemaButton: Locator;
  readonly tabStructureButton: Locator;
  readonly tabSnapshotsButton: Locator;

  readonly proseMirror: Locator;

  readonly stateLogNodeButtons: Locator;

  readonly saveSnapshotButton: Locator;
  readonly listItemActive: Locator;
  readonly listItemInactive: Locator;

  constructor(page: Page) {
    this.page = page;
    this.collapsedButton = page.locator(
      "[data-test-id=__prosemirror_devtools_collapsed_button__]"
    );
    this.devToolsContainer = page.locator(
      "[data-test-id=__prosemirror_devtools_container__]"
    );
    this.closeButton = page.locator(
      "[data-test-id=__prosemirror_devtools_close_button__]"
    );

    // tabs
    this.tabButtonsConatiner = page.locator(
      "[data-test-id=__prosemirror_devtools_tabs_buttons_container__]"
    );
    this.tabStateButton = this.tabButtonsConatiner.getByText("State", {
      exact: true,
    });
    this.tabHistoryButton = this.tabButtonsConatiner.getByText("History");
    this.tabPluginsButton = this.tabButtonsConatiner.getByText("Plugins");
    this.tabSchemaButton = this.tabButtonsConatiner.getByText("Schema");
    this.tabStructureButton =
      this.tabButtonsConatiner.locator("text=Structure");
    this.tabSnapshotsButton =
      this.tabButtonsConatiner.locator("text=Snapshots");

    // ProseMirror
    this.proseMirror = page.locator(".ProseMirror");

    // log buttons
    this.stateLogNodeButtons = page.locator(
      "[data-test-id=__prosemirror_devtools_log_node_button__]"
    );

    this.saveSnapshotButton = page.getByText("Save snapshots", { exact: true });

    this.listItemActive = page.locator(
      "[data-test-id=__prosemirror_devtools_list_item__]"
    );
    this.listItemInactive = page.locator(
      "[data-test-id=__prosemirror_devtools_list_item_inactive__]"
    );
  }

  async goto() {
    await this.page.goto("http://localhost:3000/");
  }

  locateTab(
    id: "history" | "state" | "plugins" | "schema" | "snapshots" | "structure"
  ) {
    return this.page.locator(
      `[data-test-id=__prosemirror_devtools_tabs_${id}__]`
    );
  }
}
