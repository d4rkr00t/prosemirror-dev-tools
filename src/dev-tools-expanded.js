import React from "react";
import Dock from "react-dock";
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const DockContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #363755;
  font-family: Helvetica Neue,Calibri Light,Roboto,sans-serif;

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
    }
  }
`;

const TabLabel = styled.div`
  color: rgba(255, 255, 255, .9);
  text-transform: uppercase;
  font-size: 13px;
  padding: 16px 24px;
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

Tabs.setUseDefaultStyles(false);

export default class DevTools extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
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
                <Tab><TabLabel>Graph</TabLabel></Tab>
              </TabList>
              <TabPanel>
                <h2>Hello from Foo</h2>
              </TabPanel>
              <TabPanel>
                <h2>Hello from Bar</h2>
              </TabPanel>
              <TabPanel>
                <h2>Hello from Baz</h2>
              </TabPanel>
            </Tabs>
          </DockContainer>
        )}
      </Dock>
    );
  }
}
