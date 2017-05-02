import { Controller } from "cerebral";
import createEditorModule from "./modules/editor";
import createStateTabModule from "./modules/state-tab";
import createPluginsTabModule from "./modules/plugins-tab";
import createStructureTabModule from "./modules/structure-tab";

export function toggleDevTools({ state }) {
  state.set("opened", !state.get("opened"));
}

export function selectTab({ state, props }) {
  state.set("tabIndex", props.index);
}

export default function createController(editorView, props) {
  return Controller({
    state: {
      opened: false,
      tabIndex: 0
    },
    signals: {
      devToolsToggled: toggleDevTools,
      tabSelected: selectTab
    },
    modules: {
      editor: createEditorModule(editorView, props),
      stateTab: createStateTabModule(),
      pluginsTab: createPluginsTabModule(),
      structureTab: createStructureTabModule(editorView.state.schema)
    }
  });
}
