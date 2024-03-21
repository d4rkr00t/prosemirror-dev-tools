import { Plugin, PluginKey } from "prosemirror-state";

function createPluginState() {
  return {
    doSomething() {},
    apple: "apple",
    cherry: "cherry",
    dog: "dog",
    elephant: "elephant",
    frog: "frog",
    banana: "banana",
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
