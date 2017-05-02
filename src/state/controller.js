import { Controller } from "cerebral";
import createEditorModule from "./modules/editor";
import createStateTabModule from "./modules/state-tab";
import createPluginsTabModule from "./modules/plugins-tab";
import createStructureTabModule from "./modules/structure-tab";

export function toggleDevTools({ state }) {
  const opened = state.get("opened");
  const defaultSize = state.get("defaultSize");

  if (opened) {
    document.querySelector("html").style.marginBottom = "";
  } else {
    const size = defaultSize * window.innerHeight;
    document.querySelector("html").style.marginBottom = `${size}px`;
  }

  state.set("opened", !opened);
}

export function selectTab({ state, props }) {
  state.set("tabIndex", props.index);
}

export function updateBodyMargin({ props }) {
  const size = props.size * window.innerHeight;
  document.querySelector("html").style.marginBottom = `${size}px`;
}

export default function createController(editorView, props) {
  return Controller({
    state: {
      opened: false,
      tabIndex: 0,
      defaultSize: 0.5
    },
    signals: {
      devToolsToggled: toggleDevTools,
      tabSelected: selectTab,
      devToolsSizeChanged: updateBodyMargin
    },
    modules: {
      editor: createEditorModule(editorView, props),
      stateTab: createStateTabModule(),
      pluginsTab: createPluginsTabModule(),
      structureTab: createStructureTabModule(editorView.state.schema)
    }
  });
}
