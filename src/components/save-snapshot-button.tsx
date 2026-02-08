import React, { MouseEventHandler } from "react";
import { useAtomValue } from "jotai";
import theme from "../theme";
import { useSnapshots } from "../state/snapshots";
import { editorStateAtom } from "../state/editor-state";
import { css } from "@compiled/react";

const saveSnapshotButtonStyles = css({
  appearance: "none",
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
  border: "none",

  "&:hover": {
    backgroundColor: theme.main80,
    cursor: "pointer",
  },
});
const SaveSnapshotButton = ({
  children,
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <button css={saveSnapshotButtonStyles} onClick={onClick}>
    {children}
  </button>
);

export default function SaveSnapshot() {
  const [, snapshotsDispatch] = useSnapshots();
  const editorState = useAtomValue(editorStateAtom);
  const handleClick = React.useCallback(() => {
    const snapshotName = prompt("Enter snapshot name", "" + Date.now());
    if (!snapshotName || !editorState) return;
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
