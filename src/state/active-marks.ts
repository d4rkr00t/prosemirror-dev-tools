import { atom } from "jotai";
import type { Mark } from "prosemirror-model";
import type { EditorState } from "prosemirror-state";
import { editorStateAtom } from "./editor-state";

export const activeMarksAtom = atom((get) => {
  const editorState = get(editorStateAtom);
  if (!editorState) return [];
  return getActiveMarks(editorState);
});

function getActiveMarks(editorState: EditorState): Array<Mark> {
  const selection = editorState.selection;
  let marks: readonly Mark[] = [];

  if (selection.empty) {
    marks = selection.$from.marks();
  } else {
    editorState.doc.nodesBetween(selection.from, selection.to, (node) => {
      marks = marks.concat(node.marks);
    });
  }

  return marks
    .reduce<Array<Mark>>((acc, mark) => {
      if (acc.indexOf(mark) === -1) {
        acc.push(mark);
      }
      return acc;
    }, [])
    .map((m) => m.toJSON());
}
