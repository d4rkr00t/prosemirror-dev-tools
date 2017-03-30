import React from "react";
import ReactDOM from "react-dom";
import DevTools from "./dev-tools";

export default function applyDevTools(editorView, options = {}) {
  const place = document.createElement("div");
  document.body.appendChild(place);
  ReactDOM.render(<DevTools editorView={editorView} />, place);
}
