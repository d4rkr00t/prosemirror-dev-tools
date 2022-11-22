import { useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { editorStateAtom } from "../state/editor-state";
import { editorViewAtom } from "../state/editor-view";
import { historyRolledBackToAtom, historyWriteAtom } from "../state/history";
import subscribeOnUpdates from "../utils/subscribe-on-updates";

export function useSubscribeToEditorView(editorView, shouldDiffInWorker) {
  const setEditorView = useSetAtom(editorViewAtom);
  const historyDispatcher = useSetAtom(historyWriteAtom);
  const setEditorState = useSetAtom(editorStateAtom);
  const diffWorker = shouldDiffInWorker
    ? import("../state/json-diff-worker").then(
        ({ JsonDiffWorker }) => new JsonDiffWorker(props.diffWorker)
      )
    : import("../state/json-diff-main").then(
        ({ JsonDiffMain }) => new JsonDiffMain()
      );

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
