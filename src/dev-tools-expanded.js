import React from "react";
import Dock from "react-dock";
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Subscribe } from "unstated";
import GlobalStateContainer from "./state/global";
import EditorStateContainer from "./state/editor";
import StateTab from "./tabs/state";
import HistoryTab from "./tabs/history";
import SchemaTab from "./tabs/schema";
import PluginsTab from "./tabs/plugins";
import StructureTab from "./tabs/structure";
import SnapshotsTab from "./tabs/snapshots";
import CSSReset from "./components/css-reset";
import { NodePicker, NodePickerTrigger } from "./components/node-picker";
import SaveSnapshotButton from "./components/save-snapshot-button";

const DockContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${props => props.theme.mainBg};
  font-family: Helvetica Neue, Calibri Light, Roboto, sans-serif;
  font-size: 13px;

  .tabs {
    height: 100%;
    width: 100%;

    ul {
      margin: 0;
      padding: 0;
    }

    .tabs__tablist {
      display: flex;
      list-style: none;
      border-bottom: 1px solid ${props => props.theme.main20};
    }

    .tabs_tab-panel--selected {
      height: 100%;
    }

    .tabs--selected {
      border-bottom: 2px solid ${props => props.theme.main};
    }
  }
`;

const TabLabel = styled.div`
  color: ${props => props.theme.white};
  text-transform: uppercase;
  font-size: 13px;
  padding: 16px 24px 14px;
  box-sizing: border-box;
  user-select: none;

  &:hover {
    cursor: pointer;
    background: ${props => props.theme.white05};
  }

  &:focus {
    outline: none;
  }
`;

const TabPanelWrapper = styled.div`
  width: 100%;
  height: calc(100% - 48px);
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  right: 0;
  color: ${props => props.theme.white60};
  font-size: 18px;

  &:hover {
    cursor: pointer;
    background: ${props => props.theme.white05};
    color: ${props => props.theme.white};
  }

  &:focus {
    outline: none;
  }
`;

export default function DevToolsExpanded() {
  return (
    <Subscribe to={[GlobalStateContainer, EditorStateContainer]}>
      {(globalState, editorState) => {
        const { defaultSize, tabIndex } = globalState.state;
        const { toggleDevTools, updateBodyMargin, selectTab } = globalState;
        const {
          activatePicker,
          deactivatePicker,
          updateNodePickerPossition,
          nodePickerSelect,
          saveSnapshot
        } = editorState;
        const { nodePicker, state } = editorState.state;
        return (
          <CSSReset>
            <NodePicker
              nodePicker={nodePicker}
              onClose={deactivatePicker}
              onMouseMove={updateNodePickerPossition}
              onSelect={target => {
                nodePickerSelect(target);
                selectTab(0); // Switch to the "State" tab.
              }}
            />
            <Dock
              position="bottom"
              dimMode="none"
              isVisible
              defaultSize={defaultSize}
              onSizeChange={updateBodyMargin}
            >
              {() => (
                <DockContainer>
                  <CloseButton onClick={toggleDevTools}>×</CloseButton>
                  <NodePickerTrigger
                    onClick={
                      nodePicker.active ? deactivatePicker : activatePicker
                    }
                    isActive={nodePicker.active}
                  />
                  <SaveSnapshotButton
                    onClick={() => saveSnapshot(state.doc.toJSON())}
                  >
                    Save Snapshot
                  </SaveSnapshotButton>
                  <Tabs
                    className="tabs"
                    selectedTabClassName="tabs--selected"
                    selectedTabPanelClassName="tabs_tab-panel--selected"
                    selectedIndex={tabIndex}
                    onSelect={selectTab}
                  >
                    <TabList className="tabs__tablist">
                      <Tab>
                        <TabLabel>State</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>History</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>Plugins</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>Schema</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>Structure</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>Snapshots</TabLabel>
                      </Tab>
                    </TabList>
                    <TabPanel>
                      <TabPanelWrapper>
                        <StateTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <HistoryTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <PluginsTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <SchemaTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <StructureTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <SnapshotsTab />
                      </TabPanelWrapper>
                    </TabPanel>
                  </Tabs>
                </DockContainer>
              )}
            </Dock>
          </CSSReset>
        );
      }}
    </Subscribe>
  );
}
