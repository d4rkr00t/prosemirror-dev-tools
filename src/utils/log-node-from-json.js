import { findNodeInJSON } from "./find-node";

export const logNodeFromJSON =
  (state) =>
  ({ doc, node }) => {
    const fullDoc = state.doc;
    const path = findNodeInJSON(doc, node);
    if (path) {
      console.log(path.reduce((node, pathItem) => node[pathItem], fullDoc));
    } else {
      console.log(node);
    }
  };
