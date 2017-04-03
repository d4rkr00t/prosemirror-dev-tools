import React from "react";
import ReactDOM from "react-dom";
import DevTools from "./dev-tools";

export default function applyDevTools(editorView, options = {}) {
  const place = document.createElement("div");
  document.body.appendChild(place);
  ReactDOM.render(<DevTools editorView={editorView} />, place);
}

// TODO: Copy doc button
// TODO: Redux / Cerebral
// TODO: Move State subscription to the top most component
// TODO: Plugins View
// TODO: Graph View
// TODO: Keyboard navigation in lists
// TODO: Clean everything up
// TODO: Fix colour scheme
// TODO: Hover on the node in StateView highlights actual node in the editor
// TODO: Highlight current node in StateView
// TODO: Collapse button for JSON Tree View
// TODO: Add animations
