import React from "react";
import { Subscribe } from "unstated";
import GlobalStateContainer from "./state/global";
import EditorStateContainer from "./state/editor";
import DevToolsCollapsed from "./dev-tools-collapsed";
import DevToolsExpanded from "./dev-tools-expanded";

export default function DevTools({ editorView, props }) {
  return (
    <Subscribe to={[GlobalStateContainer, EditorStateContainer]}>
      {({ state, toggleDevTools }, { registerEditorView }) => {
        registerEditorView(editorView, props);

        return state.opened ? (
          <DevToolsExpanded />
        ) : (
          <DevToolsCollapsed onClick={toggleDevTools} />
        );
      }}
    </Subscribe>
  );
}
