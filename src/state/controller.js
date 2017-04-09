import { Controller } from "cerebral";
import Devtools from "cerebral/devtools";
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

export default function createController(editorView) {
  return Controller({
    // devtools: Devtools({ remoteDebugger: "127.0.0.1:5353" }),
    state: {
      opened: false,
      tabIndex: 0
    },
    signals: {
      devToolsToggled: toggleDevTools,
      tabSelected: selectTab
    },
    modules: {
      editor: createEditorModule(editorView),
      stateTab: createStateTabModule(),
      pluginsTab: createPluginsTabModule(),
      structureTab: createStructureTabModule(editorView.state.schema)
    }
  });
}
