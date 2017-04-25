import React from "react";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";

import InfoPanel from "../components/info-panel";
import JSONTree from "../components/json-tree";
import { ListItem } from "../components/list";
import { SplitView, SplitViewCol } from "../components/split-view";

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
            <ListItem
              key={plugin.key}
              isSelected={selected === index}
              isDimmed={!plugin.getState(state)}
              onClick={() => pluginSelected({ index })}
            >
              {plugin.key}
            </ListItem>
          ))}
        </SplitViewCol>
        <SplitViewCol grow sep>
          {selectedPluginState
            ? <JSONTree data={selectedPluginState} />
            : <InfoPanel>Plugin doesn't have any state</InfoPanel>}
        </SplitViewCol>
      </SplitView>
    );
  }
);
