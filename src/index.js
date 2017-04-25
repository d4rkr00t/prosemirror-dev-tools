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
  const schemaUpdated = controller.getSignal("structureTab.schemaUpdated");

  subscribeOnUpdates(editorView, (tr, value, oldState, newState) => {
    editorUpdated({ tr, value, oldState, newState });

    // TODO: Fix, probably wrong
    if (oldState.schema === newState.schema) {
      schemaUpdated({ schema: newState.schema });
    }
  });

  addKeyBindings(controller);

  ReactDOM.render(
    <Container controller={controller}>
      <DevTools editorView={editorView} />
    </Container>,
    place
  );
}

// TODO: Clean everything up
// TODO: Use styled-components themes
// TODO: Jest
// TODO: TravisCI
// TODO: pmm
// TODO: Move all todos to issues
// TODO: ====================== MVP ============================

// TODO: Find all prosemirror instances on given page and be able to switch between them
// TODO: Log document
// TODO: Dim history states where only selection changed
// TODO: Do not compare states with only selection changed
// TODO: Scroll highlighted node into view
// TODO: Keyboard navigation in lists
// TODO: Hover on the node in StateView highlights actual node in the editor
// TODO: Collapse button for JSON Tree View
// TODO: Visual schema representation
// TODO: Cerebral DevTools
// TODO: CMD + Click logs JSON
// TODO: Fix Selection — $from and $to should have pos
// TODO: Fix logging attributes
