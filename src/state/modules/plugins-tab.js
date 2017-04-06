export function selectPlugin({ state, props }) {
  state.set("pluginsTab.selected", props.index);
}

export default function createPluginsTabModule() {
  return {
    state: {
      selected: 0
    },
    signals: {
      pluginSelected: selectPlugin
    }
  };
}
