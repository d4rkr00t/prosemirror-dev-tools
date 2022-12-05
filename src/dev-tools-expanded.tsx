import React from "react";
import { Dock } from "react-dock";
import styled from "@emotion/styled";
import { Tab, Tabs, TabList, TabPanel } from "./components/tabs";
import {
  devToolsOpenedAtom,
  devToolsSizeAtom,
  devToolTabIndexAtom,
} from "./state/global";
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
import { useAtom, useAtomValue } from "jotai";
import { useNodePicker } from "./state/node-picker";
import type { rollbackHistoryFn } from "./hooks/use-rollback-history";

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

type DevToolsExpandedProps = {
  rollbackHistory: rollbackHistoryFn;
};
export default function DevToolsExpanded({
  rollbackHistory,
}: DevToolsExpandedProps) {
  const [isOpen, setIsOpen] = useAtom(devToolsOpenedAtom);
  const defaultSize = useAtomValue(devToolsSizeAtom);
  const [tabIndex, setTabIndex] = useAtom(devToolTabIndexAtom);
  const updateBodyMargin = React.useCallback((devToolsSize) => {
    const size = devToolsSize * window.innerHeight;
    document.querySelector("html")!.style.marginBottom = `${size}px`;
  }, []);
  const [nodePicker, nodePickerAPI] = useNodePicker();
  const toggleOpen = React.useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const renderTab = React.useCallback(
    ({ index }) => {
      switch (index) {
        case "state":
          return <StateTab />;
        case "history":
          return <HistoryTab rollbackHistory={rollbackHistory} />;
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
    },
    [rollbackHistory]
  );

  const renderDockContent = React.useCallback(() => {
    return (
      <DockContainer>
        <CloseButton onClick={toggleOpen}>×</CloseButton>
        <NodePickerTrigger
          onClick={nodePickerAPI.activate}
          isActive={nodePicker.active}
        />
        <SaveSnapshotButton />

        <Tabs onSelect={setTabIndex} selectedIndex={tabIndex}>
          <TabList>
            <Tab index="state">State</Tab>
            <Tab index="history">History</Tab>
            <Tab index="plugins">Plugins</Tab>
            <Tab index="schema">Schema</Tab>
            <Tab index="structure">Structure</Tab>
            <Tab index="snapshots">Snapshots</Tab>
          </TabList>

          <TabPanel>{renderTab}</TabPanel>
        </Tabs>
      </DockContainer>
    );
  }, [nodePicker, nodePickerAPI, tabIndex, isOpen, renderTab]);

  return (
    <CSSReset>
      <NodePicker />
      <Dock
        position="bottom"
        dimMode="none"
        isVisible
        defaultSize={defaultSize}
        onSizeChange={updateBodyMargin}
      >
        {renderDockContent}
      </Dock>
    </CSSReset>
  );
}
