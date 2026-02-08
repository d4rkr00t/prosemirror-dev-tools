import { useSetAtom } from "jotai";
import type { EditorView } from "prosemirror-view";
import React from "react";
import { editorStateAtom } from "../state/editor-state";
import { editorViewAtom } from "../state/editor-view";
import { historyWriteAtom } from "../state/history";
import subscribeOnUpdates from "../utils/subscribe-on-updates";

export function useSubscribeToEditorView(editorView: EditorView, diffWorkerInstance?: Worker) {
  const setEditorView = useSetAtom(editorViewAtom);
  const historyDispatcher = useSetAtom(historyWriteAtom);
  const setEditorState = useSetAtom(editorStateAtom);
  const diffWorker = diffWorkerInstance
    ? import("../state/json-diff-worker").then(
        ({ JsonDiffWorker }) => new JsonDiffWorker(diffWorkerInstance),
      )
    : import("../state/json-diff-main").then(({ JsonDiffMain }) => new JsonDiffMain());

  React.useEffect(() => {
    // set initial editor state
    setEditorState(editorView.state);

    // store editor view reference
    setEditorView(editorView);

    historyDispatcher({ type: "reset", payload: { state: editorView.state } });

    subscribeOnUpdates(editorView, (tr, oldState, newState) => {
      setEditorState(newState);

      historyDispatcher({
        type: "update",
        payload: {
          oldState,
          newState,
          tr,
          diffWorker,
        },
      });
    });
  }, [editorView, diffWorker]);
}
