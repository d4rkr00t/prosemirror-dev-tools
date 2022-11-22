import React from "react";
import { InfoPanel } from "../components/info-panel";
import { Heading } from "../components/heading";
import JSONTree from "../components/json-tree";
import { List } from "../components/list";
import { SplitView, SplitViewCol } from "../components/split-view";
import { atom, useAtom, useAtomValue } from "jotai";
import { editorStateAtom } from "../state/editor-state";

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

const selectedPluginIndexAtom = atom(0);

// TODO: replace isDimmed with useCallback once EditorStateContainer is decomposed
export default function PluginsTab() {
  const [selectedIndex, setSelected] = useAtom(selectedPluginIndexAtom);
  const isSelected = React.useCallback(
    (_plugin, index) => selectedIndex === index,
    [selectedIndex]
  );
  const handleOnListItemClick = React.useCallback(
    (_plugin, index) => setSelected(index),
    []
  );
  const state = useAtomValue(editorStateAtom);

  const plugins = state.plugins;
  const selectedPlugin = plugins[selectedIndex];
  const selectedPluginState = selectedPlugin.getState(state);

  return (
    <SplitView>
      <SplitViewCol noPaddings>
        <List
          items={plugins}
          getKey={(plugin) => plugin.key}
          title={(plugin) => plugin.key}
          isSelected={isSelected}
          isDimmed={(plugin) => !plugin.getState(state)}
          onListItemClick={handleOnListItemClick}
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
}
