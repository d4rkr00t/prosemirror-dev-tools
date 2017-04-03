import React from "react";
import Dock from "react-dock";
import styled from "styled-components";
import { EditorState } from "prosemirror-state";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import StateView from "./state-view";
import HistoryView from "./history-view";
import SchemaView from "./schema-view";
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
    this.state = this.getUpdatedState(props.editorView.state);
    this.state.editorView = props.editorView;

    subscribeOnUpdates(props.editorView, (...args) => this.onUpdate(...args));
  }

  getUpdatedState(state, skipHistory = false) {
    let history = this.state && this.state.history ? this.state.history : [];
    const movedToStateInHistory = skipHistory
      ? this.state.movedToStateInHistory
      : false;

    if (!skipHistory) {
      const startIndex = this.state && this.state.movedToStateInHistory
        ? this.state.movedToStateInHistory
        : 0;
      history = history.slice(startIndex, 100);
      const prev = history[0];
      const num = prev ? prev.num + 1 : 1;
      history.unshift({
        doc: state.doc.toJSON(),
        selection: state.selection,
        timestamp: Date.now(),
        num
      });
    }

    return {
      doc: state.doc,
      selection: state.selection,
      historyItem: skipHistory ? this.state.historyItem : 0,
      movedToStateInHistory,
      history
    };
  }

  onUpdate(tr, value, oldState, newState) {
    const skipHistory = tr.getMeta("_skip-dev-tools-history_");
    this.setState(this.getUpdatedState(newState, skipHistory));
  }

  moveToState(index) {
    const { state } = this.state.editorView;
    const history = this.state.history[index];

    const newState = EditorState.create({
      schema: state.schema,
      plugins: state.plugins,
      doc: state.schema.nodeFromJSON(history.doc)
    });

    this.state.editorView.updateState(newState);
    this.state.editorView.dom.focus();
    const tr = this.state.editorView.state.tr
      .setSelection(history.selection)
      .setMeta("addToHistory", false)
      .setMeta("_skip-dev-tools-history_", true);
    this.state.editorView.dispatch(tr);

    this.setState({ movedToStateInHistory: index });
  }

  selectHistoryItem(index) {
    this.setState({ historyItem: index });
  }

  render() {
    return (
      <Dock position="bottom" dimMode="none" isVisible defaultSize={0.5}>
        {() => (
          <DockContainer>
            <Tabs>
              <TabList>
                <Tab><TabLabel>State</TabLabel></Tab>
                <Tab><TabLabel>History</TabLabel></Tab>
                <Tab><TabLabel>Plugins</TabLabel></Tab>
                <Tab><TabLabel>Schema</TabLabel></Tab>
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
                  <HistoryView
                    history={this.state.history}
                    movedToStateInHistory={this.state.movedToStateInHistory}
                    selectedItem={this.state.history[this.state.historyItem]}
                    prevItem={this.state.history[this.state.historyItem + 1]}
                    onClick={index => this.selectHistoryItem(index)}
                    onDoubleClick={index => this.moveToState(index)}
                  />
                </TabPanelWrapper>
              </TabPanel>
              <TabPanel>
                <TabPanelWrapper>
                  Tab 3
                </TabPanelWrapper>
              </TabPanel>
              <TabPanel>
                <TabPanelWrapper>
                  <SchemaView schema={this.state.editorView.state.schema} />
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
    );
  }
}
