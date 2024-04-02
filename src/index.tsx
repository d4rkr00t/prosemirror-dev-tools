import React from "react";
import ReactDOM from "react-dom";
import type { EditorView } from "prosemirror-view";
import DevTools from "./dev-tools";

const DEVTOOLS_CLASS_NAME = "__prosemirror-dev-tools__";

function createPlace() {
  let place = document.querySelector(`.${DEVTOOLS_CLASS_NAME}`);

  if (!place) {
    place = document.createElement("div");
    place.className = DEVTOOLS_CLASS_NAME;
    document.body.appendChild(place);
  } else {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(place);
    place.innerHTML = "";
  }

  return place;
}

type DevToolsProps = { diffWorker?: Worker };
function applyDevTools(editorView: EditorView, props: DevToolsProps) {
  const place = createPlace();
  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(
    <DevTools editorView={editorView} diffWorker={props?.diffWorker} />,
    place
  );

  return () => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(place);
  };
}

export default applyDevTools;
export { applyDevTools };
