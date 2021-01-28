import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "unstated";
import DevTools from "./dev-tools";
import EditorStateContainer from "./state/editor";

const DEVTOOLS_CLASS_NAME = "__prosemirror-dev-tools__";
let containerElement = null;

function createOrFindPlace() {
  let place = document.querySelector(`.${DEVTOOLS_CLASS_NAME}`);

  if (!place) {
    place = document.createElement("div");
    place.className = DEVTOOLS_CLASS_NAME;
    document.body.appendChild(place);
  }

  return place;
}

function applyDevTools(editorView, props) {
  const place = createOrFindPlace();
  const editorState = new EditorStateContainer(editorView, props);
  containerElement = place;

  ReactDOM.render(
    <Provider inject={[editorState]}>
      <DevTools />
    </Provider>,
    place
  );

  return () => {
    ReactDOM.unmountComponentAtNode(place);
  };
}

function removeDevTools() {
  if (containerElement) {
    ReactDOM.unmountComponentAtNode(containerElement);
  }
}

export default applyDevTools;
export { applyDevTools, removeDevTools };
