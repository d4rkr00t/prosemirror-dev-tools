import React from "react";
import ReactDOM from "react-dom";
import { Container } from "cerebral/react";
import { ThemeProvider } from "styled-components";

import createController from "./state/controller";
import subscribeOnUpdates from "./utils/subscribe-on-updates";
import DevTools from "./dev-tools";
import addKeyBindings from "./keybindings";
import theme from "./theme";

function applyDevTools(editorView, props) {
  const place = document.createElement("div");
  document.body.appendChild(place);

  const controller = createController(editorView, props);
  const editorUpdated = controller.getSignal("editor.updated");
  const schemaUpdated = controller.getSignal("structureTab.schemaUpdated");

  subscribeOnUpdates(editorView, (tr, oldState, newState) => {
    editorUpdated({ tr, oldState, newState });

    if (oldState.schema === newState.schema) {
      schemaUpdated({ schema: newState.schema });
    }
  });

  addKeyBindings(controller);

  ReactDOM.render(
    <Container controller={controller}>
      <ThemeProvider theme={theme}>
        <DevTools editorView={editorView} />
      </ThemeProvider>
    </Container>,
    place
  );
}

export default applyDevTools;
export { applyDevTools };
