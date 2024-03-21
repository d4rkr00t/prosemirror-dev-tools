import React, { useState } from "react";
import type { Plugin } from "prosemirror-state";
import { InfoPanel } from "../components/info-panel";
import { Heading } from "../components/heading";
import JSONTree from "../components/json-tree";
import { List } from "../components/list";
import { SplitView, SplitViewCol } from "../components/split-view";
import { useAtomValue } from "jotai";
import { editorStateAtom } from "../state/editor-state";
import SearchBar from "../components/search-bar";
import Button from "../components/button";

export function valueRenderer(raw: string, ...rest: Array<string>) {
  if (typeof rest[0] === "function") {
    return "func";
  }
  return raw;
}

export function PluginState(props: { pluginState: any }) {
  return (
    <div>
      <Heading>Plugin State</Heading>
      <JSONTree
        data={props.pluginState}
        valueRenderer={valueRenderer}
        sortObjectKeys={true}
      />
    </div>
  );
}

// TODO: replace isDimmed with useCallback once EditorStateContainer is decomposed
export default function PluginsTab() {
  const state = useAtomValue(editorStateAtom);
  if (!state) return null;

  const [selectedPlugin, setSelectedPlugin] = useState(state.plugins[0]);
  const [pluginsLocal, setPluginsLocal] = useState(state.plugins);
  const [sortAsc, setSortOrder] = useState(true);

  const handleOnListItemClick = React.useCallback(
    (_plugin) => setSelectedPlugin(_plugin),
    []
  );

  const selectedPluginState = selectedPlugin.getState(state);

  const handleSearch = (input: string) => {
    const filteredPlugins = (state.plugins as any as Plugin<any>[]).filter(
      (plugin) => {
        return (plugin as any).key.toLowerCase().includes(input.toLowerCase());
      }
    );
    setPluginsLocal(filteredPlugins);
  };

  const handleClickSort = () => {
    setSortOrder(!sortAsc);
  };

  const handleSortAsc = (plugins: any) => {
    return [...plugins].sort((a, b) => {
      if ((a as any).key < (b as any).key) {
        return -1;
      }
      if ((a as any).key > (b as any).key) {
        return 1;
      }
      return 0;
    });
  };
  const handleSortDes = (plugins: any) => {
    return [...plugins].sort((a, b) => {
      if ((a as any).key < (b as any).key) {
        return 1;
      }
      if ((a as any).key > (b as any).key) {
        return -1;
      }
      return 0;
    });
  };

  return (
    <SplitView testId="__prosemirror_devtools_tabs_plugins__">
      <SplitViewCol noPaddings>
        <div
          style={{
            display: "flex",
            marginLeft: 6,
            marginRight: 6,
            marginBottom: 3,
            marginTop: 3,
          }}
        >
          <SearchBar onSearch={handleSearch} />
          <Button onClick={handleClickSort}>
            SORT {sortAsc ? "DES" : "ASC"}
          </Button>
        </div>
        <List
          items={
            sortAsc ? handleSortAsc(pluginsLocal) : handleSortDes(pluginsLocal)
          }
          getKey={(plugin: Plugin) => (plugin as any).key}
          title={(plugin: Plugin) => (plugin as any).key}
          isDimmed={(plugin: Plugin) => !plugin.getState(state)}
          onListItemClick={handleOnListItemClick}
        />
      </SplitViewCol>
      <SplitViewCol grow sep>
        {selectedPluginState ? (
          <PluginState pluginState={selectedPluginState} />
        ) : (
          <InfoPanel>Plugin doesn&apos;t have any state</InfoPanel>
        )}
      </SplitViewCol>
    </SplitView>
  );
}
