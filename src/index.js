import React from "react";
import ReactDOM from "react-dom";
import { Container } from "cerebral/react";
import createController from "./state/controller";
import subscribeOnUpdates from "./utils/subscribe-on-updates";
import DevTools from "./dev-tools";
import addKeyBindings from "./keybindings";

export default function applyDevTools(editorView) {
  const place = document.createElement("div");
  document.body.appendChild(place);

  const controller = createController(editorView);
  const editorUpdated = controller.getSignal("editor.updated");

  subscribeOnUpdates(editorView, (tr, value, oldState, newState) => {
    editorUpdated({ tr, value, oldState, newState });
  });

  addKeyBindings(controller);

  ReactDOM.render(
    <Container controller={controller}>
      <DevTools editorView={editorView} />
    </Container>,
    place
  );
}

// TODO: Graph View
// TODO: Print node
// TODO: Scroll highlighted node into view
// TODO: Keyboard navigation in lists
// TODO: Clean everything up
// TODO: Fix colour scheme
// TODO: Cerebral DevTools
// TODO: Hover on the node in StateView highlights actual node in the editor
// TODO: Collapse button for JSON Tree View
// TODO: Visual schema representation
