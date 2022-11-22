import { atom } from "jotai";
import { editorStateAtom } from "./editor-state";

export const schemaAtom = atom((get) => {
  const editorState = get(editorStateAtom);
  if (!editorState) return null;
  return editorState.schema;
});
