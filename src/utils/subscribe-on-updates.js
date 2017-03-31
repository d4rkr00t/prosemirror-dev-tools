import { Plugin } from "prosemirror-state";

export default function subscribeOnUpdates(editorView, callback) {
  const plugin = new Plugin({
    view() {
      return {
        update(view, prevState) {
          callback(view, prevState);
        }
      };
    }
  });

  const { state } = editorView;
  const newState = state.reconfigure({
    scheme: state.scheme,
    plugins: [plugin].concat(state.plugins)
  });

  editorView.updateState(newState);
}
