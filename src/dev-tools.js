import React from "react";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";
import DevToolsCollapsed from "./dev-tools-collapsed";
import DevToolsExpanded from "./dev-tools-expanded";

export default connect(
  {
    opened: state`opened`,
    devToolsToggled: signal`devToolsToggled`
  },
  function DevTools({ opened, devToolsToggled }) {
    if (opened) {
      return <DevToolsExpanded onClick={devToolsToggled} />;
    } else {
      return <DevToolsCollapsed onClick={devToolsToggled} />;
    }
  }
);
