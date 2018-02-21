import React from "react";
import { Subscribe } from "unstated";
import EditorStateContainer from "../state/editor";
import PluginsTabStateContainer from "../state/plugins-tab";
import { InfoPanel } from "../components/info-panel";
import { Heading } from "./../components/heading";
import JSONTree from "../components/json-tree";
import { List } from "../components/list";
import { SplitView, SplitViewCol } from "../components/split-view";

export function valueRenderer(raw, ...rest) {
  if (typeof rest[0] === "function") {
    return "func";
  }
  return raw;
}

export function PluginState(props) {
  return (
    <div>
      <Heading>Plugin State</Heading>
      <JSONTree data={props.pluginState} valueRenderer={valueRenderer} />
    </div>
  );
}

export default function PluginsTab() {
  return (
    <Subscribe to={[EditorStateContainer, PluginsTabStateContainer]}>
      {(editorState, pluginsTabState) => {
        const { state } = editorState.state;
        const plugins = state.plugins;
        const selectedPlugin = plugins[pluginsTabState.state.selected];
        const selectedPluginState = selectedPlugin.getState(state);

        return (
          <SplitView>
            <SplitViewCol noPaddings>
              <List
                items={plugins}
                getKey={plugin => plugin.key}
                title={plugin => plugin.key}
                isSelected={(plugin, index) =>
                  pluginsTabState.state.selected === index
                }
                isDimmed={plugin => !plugin.getState(state)}
                onListItemClick={(plugin, index) =>
                  pluginsTabState.selectPlugin(index)
                }
              />
            </SplitViewCol>
            <SplitViewCol grow sep>
              {selectedPluginState ? (
                <PluginState pluginState={selectedPluginState} />
              ) : (
                <InfoPanel>Plugin doesn't have any state</InfoPanel>
              )}
            </SplitViewCol>
          </SplitView>
        );
      }}
    </Subscribe>
  );
}
