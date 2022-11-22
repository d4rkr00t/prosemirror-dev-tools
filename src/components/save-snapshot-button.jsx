import React from "react";
import styled from "@emotion/styled";
import { useSnapshots } from "../state/snapshots";
import theme from "../theme";
import { useAtomValue } from "jotai";
import { editorStateAtom } from "../state/editor-state";

const SaveSnapshotButton = styled("div")({
  position: "absolute",
  right: "32px",
  top: "-28px",
  color: theme.white,
  background: theme.main60,
  fontSize: "12px",
  lineHeight: "25px",
  padding: "0 6px",
  height: "24px",
  backgroundSize: "20px 20px",
  backgroundRepeat: "none",
  backgroundPosition: "50% 50%",
  borderRadius: "3px",

  "&:hover": {
    backgroundColor: theme.main80,
    cursor: "pointer",
  },
});
SaveSnapshotButton.displayName = "SaveSnapshotButton";

export default function SaveSnapshot() {
  const [, snapshotsDispatch] = useSnapshots();
  const editorState = useAtomValue(editorStateAtom);
  const handleClick = React.useCallback(() => {
    const snapshotName = prompt("Enter snapshot name", Date.now());
    if (!snapshotName) return;
    const snapshot = {
      name: snapshotName,
      timestamp: Date.now(),
      snapshot: editorState.doc.toJSON(),
    };
    snapshotsDispatch({ type: "save", payload: { snapshot } });
  }, [editorState]);

  return (
    <SaveSnapshotButton onClick={handleClick}>
      Save snapshots
    </SaveSnapshotButton>
  );
}
