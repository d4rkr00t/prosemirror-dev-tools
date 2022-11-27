import React from "react";
import styled from "@emotion/styled";
import { SplitView, SplitViewCol } from "../components/split-view";
import { List } from "../components/list";
import { InfoPanel } from "../components/info-panel";
import theme from "../theme";
import { Snapshot, useSnapshots } from "../state/snapshots";
import getEditorStateClass from "../state/get-editor-state";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { editorViewAtom } from "../state/editor-view";
import { editorStateAtom } from "../state/editor-state";
import { historyWriteAtom } from "../state/history";

const ActionButton = styled("button")({
  padding: "6px 10px",
  fontWeight: 400,
  letterSpacing: "1px",
  fontSize: "11px",
  color: theme.white80,
  background: theme.white10,
  textTransform: "uppercase",
  transition: "background 0.3s, color 0.3s",
  borderRadius: "2px",
  border: "none",

  "& + &": {
    marginLeft: "4px",
  },

  "&:hover": {
    background: theme.main40,
    color: theme.white,
    cursor: "pointer",
  },

  "&:focus": {
    outline: "none",
  },

  "&:active": {
    background: theme.main60,
  },
});
ActionButton.displayName = "ActionButton";

const ListItem = styled("div")({
  height: "24px",
  lineHeight: "24px",
  display: "flex",
  width: "100%",
});
ListItem.displayName = "ListItem";

const ListItemTitle = styled("div")({
  flexGrow: 1,
});
ListItemTitle.displayName = "ListItemTitle";

type SnapshotsListProps = {
  snapshots: Array<Snapshot>;
  deleteSnapshot: (snapshot: Snapshot) => void;
  loadSnapshot: (snapshot: Snapshot) => void;
};
export function SnapshotsList({
  snapshots,
  deleteSnapshot,
  loadSnapshot,
}: SnapshotsListProps) {
  return (
    <List
      getKey={(item) => item.name + item.timestamp}
      items={snapshots}
      title={(item) => (
        <ListItem>
          <ListItemTitle>{item.name}</ListItemTitle>
          <div>
            <ActionButton onClick={() => deleteSnapshot(item)}>
              delete
            </ActionButton>
            <ActionButton onClick={() => loadSnapshot(item)}>
              restore
            </ActionButton>
          </div>
        </ListItem>
      )}
    />
  );
}

export default function SnapshotTab() {
  const [snapshots, snapshotsDispatch] = useSnapshots();
  const editorView = useAtomValue(editorViewAtom);
  const [editorState, setEditorState] = useAtom(editorStateAtom);
  const historyDispatcher = useSetAtom(historyWriteAtom);
  const loadSnapshot = React.useCallback(
    (snapshot) => {
      const EditorState = getEditorStateClass();

      if (!editorState) return;
      if (!editorView) return;

      const newState = EditorState.create({
        schema: editorState.schema,
        plugins: editorState.plugins,
        doc: editorState.schema.nodeFromJSON(snapshot.snapshot),
      });

      editorView.updateState(newState);
      setEditorState(newState);
      historyDispatcher({
        type: "reset",
        payload: { state: editorView.state },
      });
    },
    [editorView, editorState]
  );
  const deleteSnapshot = React.useCallback(
    (snapshot) => {
      snapshotsDispatch({ type: "delete", payload: { snapshot } });
    },
    [snapshotsDispatch]
  );

  return (
    <SplitView>
      <SplitViewCol noPaddings grow>
        {snapshots.length ? (
          <SnapshotsList
            snapshots={snapshots}
            loadSnapshot={loadSnapshot}
            deleteSnapshot={deleteSnapshot}
          />
        ) : (
          <InfoPanel>
            No saved snapshots yet. Press &quot;Save Snapshot&quot; button to
            add one.
          </InfoPanel>
        )}
      </SplitViewCol>
    </SplitView>
  );
}
