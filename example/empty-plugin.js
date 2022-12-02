import { Plugin, PluginKey } from "prosemirror-state";

function createPluginState() {
  return {
    doSomething() {},
  };
}

const key = new PluginKey("empty-plugin");
const plugin = new Plugin({
  key,
  state: {
    init() {
      return createPluginState();
    },
    apply(tr, pluginState) {
      return pluginState;
    },
  },
});

export default plugin;
