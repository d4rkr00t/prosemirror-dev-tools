import React, { MouseEventHandler } from "react";
import "@compiled/react";
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

const ActionButton = ({
  children,
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    css={{
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
        color: theme.text,
        cursor: "pointer",
      },

      "&:focus": {
        outline: "none",
      },

      "&:active": {
        background: theme.main60,
      },
    }}
  >
    {children}
  </button>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      height: "24px",
      lineHeight: "24px",
      display: "flex",
      width: "100%",
    }}
  >
    {children}
  </div>
);

const ListItemTitle = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      flexGrow: 1,
    }}
  >
    {children}
  </div>
);

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
      getKey={(item: Snapshot) => item.name + item.timestamp}
      items={snapshots}
      title={(item: Snapshot) => (
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
    (snapshot: Snapshot) => {
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
    [editorView, editorState],
  );
  const deleteSnapshot = React.useCallback(
    (snapshot: Snapshot) => {
      snapshotsDispatch({ type: "delete", payload: { snapshot } });
    },
    [snapshotsDispatch],
  );

  return (
    <SplitView testId="__prosemirror_devtools_tabs_snapshots__">
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
