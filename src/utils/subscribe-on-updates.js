import { Plugin } from "prosemirror-state";

export default function subscribeOnUpdates(editorView, callback) {
  const plugin = new Plugin({
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
