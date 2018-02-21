import "ie-array-find-polyfill";
import objectAssign from "es6-object-assign";
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { Provider } from "unstated";

import DevTools from "./dev-tools";
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

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Provider>
        <DevTools editorView={editorView} props={props} />
      </Provider>
    </ThemeProvider>,
    place
  );
}

export default applyDevTools;
export { applyDevTools };
