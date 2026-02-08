import React from "react";
import { useSetAtom } from "jotai";
import { Selection } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { editorStateAtom } from "../state/editor-state";
import { type HistoryItem, historyRolledBackToAtom } from "../state/history";
import getEditorStateClass from "../state/get-editor-state";

export type rollbackHistoryFn = (historyItem: HistoryItem, historyItemIndex: number) => void;
export function useRollbackHistory(editorView: EditorView): rollbackHistoryFn {
  const setHistoryRolledBackTo = useSetAtom(historyRolledBackToAtom);
  const setEditorState = useSetAtom(editorStateAtom);
  const rollbackHistory = React.useCallback(
    (historyItem: HistoryItem, historyItemIndex: number) => {
      const EditorState = getEditorStateClass();
      const { state } = historyItem;
      const newState = EditorState.create({
        schema: state.schema,
        plugins: state.plugins,
        doc: state.schema.nodeFromJSON(state.doc.toJSON()),
      });
      editorView.updateState(newState);
      editorView.dom.focus();
      const selection = Selection.fromJSON(editorView.state.doc, state.selection.toJSON());
      const tr = editorView.state.tr
        .setSelection(selection)
        .setMeta("addToHistory", false)
        .setMeta("_skip-dev-tools-history_", true);

      editorView.dispatch(tr);

      setEditorState(editorView.state);
      setHistoryRolledBackTo(historyItemIndex);
    },
    [editorView],
  );

  return rollbackHistory;
}
