import { atom } from "jotai";
import { editorStateAtom } from "./editor-state";

export const activeMarksAtom = atom((get) => {
  const editorState = get(editorStateAtom);
  if (!editorState) return [];
  return getActiveMarks(editorState);
});

function getActiveMarks(editorState) {
  const selection = editorState.selection;
  let marks = [];

  if (selection.empty) {
    marks = selection.storedMarks || selection.$from.marks();
  } else {
    editorState.doc.nodesBetween(selection.from, selection.to, (node) => {
      marks = marks.concat(node.marks);
    });
  }

  marks = marks
    .reduce((acc, mark) => {
      if (acc.indexOf(mark) === -1) {
        acc.push(mark);
      }
      return acc;
    }, [])
    .map((m) => m.toJSON());

  return marks;
}
