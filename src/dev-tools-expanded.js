import React from "react";
import Dock from "react-dock";
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";
import StateTab from "./tabs/state";
import HistoryTab from "./tabs/history";
import SchemaTab from "./tabs/schema";
import PluginsTab from "./tabs/plugins";
import NodePicker from "./components/node-picker";
import Button from "./components/button";

const DockContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #363755;
  font-family: Helvetica Neue,Calibri Light,Roboto,sans-serif;
  font-size: 13px;

  .ReactTabs {
    height: 100%;
    width: 100%;

    ul {
      margin: 0;
      padding: 0;
    }

    .ReactTabs__TabList {
      display: flex;
      list-style: none;
      border-bottom: 1px solid rgba(255, 162, 177, .2);
    }

    .ReactTabs__TabPanel {
      height: 100%;
    }
  }
`;

const TabLabel = styled.div`
  color: rgba(255, 255, 255, .9);
  text-transform: uppercase;
  font-size: 13px;
  padding: 16px 24px 14px;
  box-sizing: border-box;
  user-select: none;

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, .05);
  }

  &:focus {
    outline: none;
  }

  .ReactTabs__Tab--selected & {
    border-bottom: 2px solid #FFA2B1;
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
  color: rgba(255, 255, 255, .6);
  font-size: 18px;

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, .05);
    color: rgba(255, 255, 255, 1);
  }

  &:focus {
    outline: none;
  }
`;

const NodePickerTrigger = styled.div`
  position: absolute;
  right: 4px;
  top: -34px;
`;

Tabs.setUseDefaultStyles(false);

export default connect(
  {
    tabIndex: state`tabIndex`,
    tabSelected: signal`tabSelected`,
    devToolsToggled: signal`devToolsToggled`,
    nodePicker: state`editor.nodePicker`,
    pickerActivated: signal`editor.pickerActivated`,
    pickerDeactivated: signal`editor.pickerDeactivated`
  },
  function DevToolsExpanded({
    tabIndex,
    tabSelected,
    devToolsToggled,
    nodePicker,
    pickerActivated,
    pickerDeactivated
  }) {
    const pickerActive = !!(nodePicker.onClick && nodePicker.onMouseOver);
    return (
      <div>
        <NodePicker />
        <Dock position="bottom" dimMode="none" isVisible defaultSize={0.5}>
          {() => (
            <DockContainer>
              <CloseButton onClick={() => devToolsToggled()}>×</CloseButton>
              <NodePickerTrigger>
                <Button
                  isSmall
                  onClick={pickerActive ? pickerDeactivated : pickerActivated}
                  isActive={pickerActive}
                >
                  ⇲
                </Button>
              </NodePickerTrigger>
              <Tabs
                selectedIndex={tabIndex}
                onSelect={index => tabSelected({ index })}
              >
                <TabList>
                  <Tab><TabLabel>State</TabLabel></Tab>
                  <Tab><TabLabel>History</TabLabel></Tab>
                  <Tab><TabLabel>Plugins</TabLabel></Tab>
                  <Tab><TabLabel>Schema</TabLabel></Tab>
                  <Tab><TabLabel>Graph</TabLabel></Tab>
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
                    Tab 5
                  </TabPanelWrapper>
                </TabPanel>
              </Tabs>
            </DockContainer>
          )}
        </Dock>
      </div>
    );
  }
);
