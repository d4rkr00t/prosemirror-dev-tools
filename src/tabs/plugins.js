import React from "react";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";
import styled from "styled-components";
import { SplitView, SplitViewCol } from "./../split-view";
import JSONTree from "./../json-tree";

const Plugin = styled.button`
  width: 180px;
  display: block;
  padding: 6px 18px;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 11px;
  color: rgba(255, 255, 255, .8);
  text-transform: uppercase;
  transition: background .3s, color .3s;
  border-radius: 2px;
  border: none;
  background: ${props => props.isSelected ? "rgba(191, 116, 135, 0.40)" : "transparent"};
  text-align: left;
  font-family: monospace;
  transition: background .3s;
  border-top: 1px solid rgba(255, 162, 177, .2);
  opacity: ${props => props.isEmpty ? 0.3 : 1};

  &:first-child {
    border-top: none;
  }

  &:hover {
    background: rgba(191, 116, 135, 0.40);
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: rgba(191, 116, 135, 0.60);
  }
`;

const NoState = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: #FFA2B1;
  font-size: 14px;
`;

export default connect(
  {
    state: state`editor.state`,
    selected: state`pluginsTab.selected`,
    pluginSelected: signal`pluginsTab.pluginSelected`
  },
  function PluginsTab({ state, selected, pluginSelected }) {
    const { plugins } = state;
    const selectedPlugin = plugins[selected];
    const selectedPluginState = selectedPlugin.getState(state);
    return (
      <SplitView>
        <SplitViewCol noPaddings>
          {plugins.map((plugin, index) => (
            <Plugin
              key={plugin.key}
              isSelected={selected === index}
              isEmpty={!plugin.getState(state)}
              onClick={() => pluginSelected({ index })}
            >
              {plugin.key}
            </Plugin>
          ))}
        </SplitViewCol>
        <SplitViewCol grow sep>
          {selectedPluginState
            ? <JSONTree data={selectedPluginState} />
            : <NoState>Plugin doesn't have any state</NoState>}
        </SplitViewCol>
      </SplitView>
    );
  }
);
