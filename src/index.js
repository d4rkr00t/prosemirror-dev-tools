import React from "react";
import ReactDOM from "react-dom";
import DevTools from "./dev-tools";

export default function applyDevTools(editorView, options = {}) {
  const place = document.createElement("div");
  document.body.appendChild(place);
  ReactDOM.render(<DevTools editorView={editorView} />, place);
}

// TODO: Copy doc button
// TODO: Custom view for document json representation
// TODO: Highlight current node in StateView
// TODO: Hover on the node in StateView highlights actual node in the editor
// TODO: Move State subscription to the top most component
// TODO: Close button
// TODO: Add animations
// TODO: Redux
// TODO: Collapse button for JSON Tree View
