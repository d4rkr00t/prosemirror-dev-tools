import React from "react";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";

import InfoPanel from "../components/info-panel";
import JSONTree from "../components/json-tree";
import { List } from "../components/list";
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
          <List
            items={plugins}
            getKey={plugin => plugin.key}
            title={plugin => plugin.key}
            isSelected={(plugin, index) => selected === index}
            isDimmed={plugin => !plugin.getState(state)}
            onListItemClick={(plugin, index) => pluginSelected({ index })}
          />
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
