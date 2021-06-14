import React from "react";
import { Subscribe } from "unstated";
import GlobalStateContainer from "./state/global";
import DevToolsCollapsed from "./dev-tools-collapsed";
import DevToolsExpanded from "./dev-tools-expanded";

export default function DevTools() {
  return (
    <Subscribe to={[GlobalStateContainer]}>
      {({ state, toggleDevTools }) =>
        state.opened ? (
          <DevToolsExpanded />
        ) : (
          <DevToolsCollapsed onClick={toggleDevTools} />
        )
      }
    </Subscribe>
  );
}
