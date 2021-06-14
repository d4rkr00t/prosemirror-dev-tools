import React from "react";
import Dock from "react-dock";
import styled from "@emotion/styled";
import { Tab, Tabs, TabList, TabPanel } from "./components/tabs";
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
import theme from "./theme";

const DockContainer = styled("div")({
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: theme.mainBg,
  fontFamily: "Helvetica Neue, Calibri Light, Roboto, sans-serif",
  fontSize: "13px",
});
DockContainer.displayName = "DockContainer";

const CloseButton = styled("button")({
  background: "none",
  border: "none",
  position: "absolute",
  right: 0,
  color: theme.white60,
  fontSize: "18px",

  "&:hover": {
    cursor: "pointer",
    background: theme.white05,
    color: theme.white,
  },

  "&:focus": {
    outline: "none",
  },
});
CloseButton.displayName = "CloseButton";

export default function DevToolsExpanded() {
  return (
    <Subscribe to={[GlobalStateContainer]}>
      {(globalState) => {
        const { defaultSize, tabIndex } = globalState.state;
        const { toggleDevTools, updateBodyMargin, selectTab } = globalState;
        return (
          <CSSReset>
            <Subscribe to={[EditorStateContainer]}>
              {({
                state: { nodePicker },
                deactivatePicker,
                updateNodePickerPossition,
                nodePickerSelect,
              }) => (
                <NodePicker
                  nodePicker={nodePicker}
                  onClose={deactivatePicker}
                  onMouseMove={updateNodePickerPossition}
                  onSelect={(target) => {
                    nodePickerSelect(target);
                    selectTab(0); // Switch to the "State" tab.
                  }}
                />
              )}
            </Subscribe>
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
                  <Subscribe to={[EditorStateContainer]}>
                    {({
                      state: { nodePicker },
                      deactivatePicker,
                      activatePicker,
                    }) => (
                      <NodePickerTrigger
                        onClick={
                          nodePicker.active ? deactivatePicker : activatePicker
                        }
                        isActive={nodePicker.active}
                      />
                    )}
                  </Subscribe>
                  <Subscribe to={[EditorStateContainer]}>
                    {({ saveSnapshot }) => (
                      <SaveSnapshotButton onClick={saveSnapshot}>
                        Save Snapshot
                      </SaveSnapshotButton>
                    )}
                  </Subscribe>

                  <Tabs onSelect={selectTab} selectedIndex={tabIndex}>
                    <TabList>
                      <Tab index="state">State</Tab>
                      <Tab index="history">History</Tab>
                      <Tab index="plugins">Plugins</Tab>
                      <Tab index="schema">Schema</Tab>
                      <Tab index="structure">Structure</Tab>
                      <Tab index="snapshots">Snapshots</Tab>
                    </TabList>

                    <TabPanel>
                      {({ index }) => {
                        switch (index) {
                          case "state":
                            return <StateTab />;
                          case "history":
                            return <HistoryTab />;
                          case "plugins":
                            return <PluginsTab />;
                          case "schema":
                            return <SchemaTab />;
                          case "structure":
                            return <StructureTab />;
                          case "snapshots":
                            return <SnapshotsTab />;
                          default:
                            return <StateTab />;
                        }
                      }}
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
