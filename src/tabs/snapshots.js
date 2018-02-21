import React from "react";
import styled from "styled-components";
import { Subscribe } from "unstated";
import EditorStateContainer from "../state/editor";
import { SplitView, SplitViewCol } from "../components/split-view";
import { List } from "../components/list";
import { InfoPanel } from "../components/info-panel";

const ActionButton = styled.button`
  padding: 6px 10px;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 11px;
  color: ${props => props.theme.white80};
  background: ${props => props.theme.white10};
  text-transform: uppercase;
  transition: background 0.3s, color 0.3s;
  border-radius: 2px;
  border: none;

  & + & {
    margin-left: 4px;
  }

  &:hover {
    background: ${props => props.theme.main40};
    color: ${props => props.theme.white};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: ${props => props.theme.main60};
  }
`;

const ListItem = styled.div`
  height: 24px;
  line-height: 24px;
  display: flex;
  width: 100%;
`;

const ListItemTitle = styled.div`
  flex-grow: 1;
`;

export function SnapshotsList({ snapshots, deleteSnapshot, loadSnapshot }) {
  return (
    <List
      getKey={item => item.name + item.timestamp}
      items={snapshots}
      title={item => (
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

export default function SnapshotsTab() {
  return (
    <Subscribe to={[EditorStateContainer]}>
      {({ state: { snapshots }, loadSnapshot, deleteSnapshot }) => {
        return (
          <SplitView>
            <SplitViewCol noPaddings grow>
              {snapshots && snapshots.length ? (
                <SnapshotsList
                  snapshots={snapshots}
                  loadSnapshot={loadSnapshot}
                  deleteSnapshot={deleteSnapshot}
                />
              ) : (
                <InfoPanel>
                  No saved snapshots yet. Press "Save Snapshot" button to add
                  one.
                </InfoPanel>
              )}
            </SplitViewCol>
          </SplitView>
        );
      }}
    </Subscribe>
  );
}
