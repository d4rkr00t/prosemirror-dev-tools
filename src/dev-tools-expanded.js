import React from "react";
import Dock from "react-dock";
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import StateView from "./state-view";
import subscribeOnUpdates from "./utils/subscribe-on-updates";

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

Tabs.setUseDefaultStyles(false);

export default class DevTools extends React.PureComponent {
  constructor(props) {
    super();
    this.state = this.getUpdatedState(props.editorView);
    subscribeOnUpdates(props.editorView, view => this.onUpdate(view));
  }

  getUpdatedState(editorView) {
    const { state } = editorView;
    return {
      doc: state.doc,
      selection: state.selection
    };
  }

  onUpdate(editorView) {
    this.setState(this.getUpdatedState(editorView));
  }

  render() {
    return (
      <Dock position="bottom" dimMode="none" isVisible>
        {() => (
          <DockContainer>
            <Tabs>
              <TabList>
                <Tab><TabLabel>State</TabLabel></Tab>
                <Tab><TabLabel>History</TabLabel></Tab>
                <Tab><TabLabel>Plugins</TabLabel></Tab>
                <Tab><TabLabel>Graph</TabLabel></Tab>
              </TabList>
              <TabPanel>
                <TabPanelWrapper>
                  <StateView
                    doc={this.state.doc}
                    selection={this.state.selection}
                  />
                </TabPanelWrapper>
              </TabPanel>
              <TabPanel>
                <TabPanelWrapper>
                  Tab 2
                </TabPanelWrapper>
              </TabPanel>
              <TabPanel>
                <TabPanelWrapper>
                  Tab 3
                </TabPanelWrapper>
              </TabPanel>
              <TabPanel>
                <TabPanelWrapper>
                  Tab 4
                </TabPanelWrapper>
              </TabPanel>
            </Tabs>
          </DockContainer>
        )}
      </Dock>
    );
  }
}
