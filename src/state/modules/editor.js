import { EditorState } from "prosemirror-state";

const HISTORY_SIZE = 100;

export function shrinkEditorHistory({ state, props }) {
  const { tr } = props;
  const skipHistory = tr.getMeta("_skip-dev-tools-history_");

  if (skipHistory) return;

  const startIndex = state.get("editor.historyRolledBackTo") !== false
    ? state.get("editor.historyRolledBackTo")
    : 0;

  const history = state.get("editor.history");
  state.set("editor.history", history.slice(startIndex, HISTORY_SIZE));
}

export function updateEditorHistory({ state, props }) {
  const { tr, newState } = props;
  const skipHistory = tr.getMeta("_skip-dev-tools-history_");

  if (skipHistory) return;

  state.unshift("editor.history", {
    state: newState,
    timestamp: Date.now()
  });

  state.set("editor.selectedHistoryItem", 0);
  state.set("editor.historyRolledBackTo", false);
}

export function updateCurrentEditorState({ state, props }) {
  state.set("editor.state", props.newState);
}

export function selectHistoryItem({ state, props }) {
  state.set("editor.selectedHistoryItem", props.index);
}

// TODO: Make it right, e.g. SIDE EFFECT
export function rollbackHistory({ state, props }) {
  const { state: editorState } = state.get(`editor.history.${props.index}`);
  const editorView = state.get("editor.view");

  const newState = EditorState.create({
    schema: editorState.schema,
    plugins: editorState.plugins,
    doc: editorState.schema.nodeFromJSON(editorState.doc.toJSON())
  });

  editorView.updateState(newState);
  editorView.dom.focus();
  const tr = editorView.state.tr
    .setSelection(editorState.selection)
    .setMeta("addToHistory", false)
    .setMeta("_skip-dev-tools-history_", true);

  editorView.dispatch(tr);

  state.set("editor.state", newState);
  state.set("editor.historyRolledBackTo", props.index);
}

export default function createEditorModule(editorView) {
  return {
    state: {
      view: editorView,
      state: editorView.state,
      history: [{ state: editorView.state, timestamp: Date.now() }],
      selectedHistoryItem: 0,
      historyRolledBackTo: false
    },
    signals: {
      updated: [
        updateCurrentEditorState,
        [shrinkEditorHistory, updateEditorHistory]
      ],
      historyItemSelected: selectHistoryItem,
      historyRolledBack: rollbackHistory
    }
  };
}
