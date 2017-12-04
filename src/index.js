import "ie-array-find-polyfill";
import objectAssign from "es6-object-assign";
import React from "react";
import ReactDOM from "react-dom";
import { Container } from "@cerebral/react";
import { ThemeProvider } from "styled-components";

import createController from "./state/controller";
import subscribeOnUpdates from "./utils/subscribe-on-updates";
import DevTools from "./dev-tools";
import addKeyBindings from "./keybindings";
import theme from "./theme";

const DEVTOOLS_CLASS_NAME = "__prosemirror-dev-tools__";

objectAssign.polyfill();

function createPlace() {
  let place = document.querySelector(`.${DEVTOOLS_CLASS_NAME}`);

  if (!place) {
    place = document.createElement("div");
    place.className = DEVTOOLS_CLASS_NAME;
    document.body.appendChild(place);
  } else {
    ReactDOM.unmountComponentAtNode(place);
    place.innerHTML = "";
  }

  return place;
}

function applyDevTools(editorView, props) {
  const place = createPlace();
  const controller = createController(editorView, props);
  const editorUpdated = controller.getSignal("editor.updated");
  const schemaUpdated = controller.getSignal("structureTab.schemaUpdated");

  subscribeOnUpdates(editorView, (tr, oldState, newState) => {
    editorUpdated({
      tr,
      oldState,
      newState,
      toJSON() {
        return {
          oldState: oldState.toJSON(),
          newState: newState.toJSON()
        };
      }
    });

    if (oldState.schema === newState.schema) {
      schemaUpdated({
        schema: newState.schema,
        toJSON() {
          return {};
        }
      });
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
