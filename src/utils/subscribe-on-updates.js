import { Plugin, PluginKey } from "prosemirror-state";

export const stateKey = new PluginKey("ProseMirrorDevTools");
export default function subscribeOnUpdates(editorView, callback) {
  const plugin = new Plugin({
    key: stateKey,
    state: {
      init() {
        return null;
      },

      apply(tr, value, oldState, newState) {
        callback(tr, value, oldState, newState);
        return null;
      }
    }
  });

  const { state } = editorView;
  const newState = state.reconfigure({
    schema: state.schema,
    plugins: [plugin].concat(state.plugins)
  });

  editorView.updateState(newState);
}
