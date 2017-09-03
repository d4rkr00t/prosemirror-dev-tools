import { DOMSerializer } from "prosemirror-model/dist/to_dom";
import diffPatcher from "jsondiffpatch";
import { prettyPrint } from "html";
import findNodeIn, { findNodeInJSON } from "../../../utils/find-node";
import getEditorStateClass from "./get-editor-state";

const HISTORY_SIZE = 200;
const SNAPSHOTS_KEY = "prosemirror-dev-tools-snapshots";

const diff = diffPatcher.create({
  arrays: { detectMove: false },
  textDiff: { minLength: 1 }
});

export function buildSelection(selection) {
  return {
    type: selection.type,
    empty: selection.empty,
    anchor: selection.anchor,
    head: selection.head,
    from: selection.from,
    to: selection.to
  };
}

export function createHistoryEntry(prevState, editorState) {
  const serializer = DOMSerializer.fromSchema(editorState.schema);
  const selection = editorState.selection;
  const domFragment = serializer.serializeFragment(selection.content().content);

  let selectionContent = [];
  if (domFragment) {
    let child = domFragment.firstChild;
    while (child) {
      selectionContent.push(child.outerHTML);
      child = child.nextSibling;
    }
  }

  return {
    state: editorState,
    timestamp: Date.now(),
    diff:
      prevState && diff.diff(prevState.doc.toJSON(), editorState.doc.toJSON()),
    selection:
      prevState &&
      diff.diff(buildSelection(prevState.selection), buildSelection(selection)),
    selectionContent: prettyPrint(selectionContent.join("\n"), {
      max_char: 60,
      indent_size: 2
    })
  };
}

export function shrinkEditorHistory({ state, props }) {
  const { tr } = props;
  const skipHistory = tr.getMeta("_skip-dev-tools-history_");

  if (skipHistory) return;

  const startIndex =
    state.get("editor.historyRolledBackTo") !== false
      ? state.get("editor.historyRolledBackTo")
      : 0;

  const history = state.get("editor.history");
  state.set("editor.history", history.slice(startIndex, HISTORY_SIZE));
}

export function updateEditorHistory({ state, props }) {
  const { tr, newState } = props;
  const skipHistory = tr.getMeta("_skip-dev-tools-history_");

  if (skipHistory) return;

  state.unshift(
    "editor.history",
    createHistoryEntry(state.get("editor.history")[0].state, newState)
  );
  state.set("editor.selectedHistoryItem", 0);
  state.set("editor.historyRolledBackTo", false);
}

export function updateCurrentEditorState({ state, props }) {
  state.set("editor.state", props.newState);
}

export function selectHistoryItem({ state, props }) {
  state.set("editor.selectedHistoryItem", props.index);
}

export function rollbackHistory(EditorState, { state, props }) {
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

export function findPMNode(domNode) {
  let node;
  let target = domNode;

  while (!node && target) {
    if (target.pmViewDesc) {
      node = target;
    }
    target = target.parentNode;
  }

  return node;
}

export function findPMNodeInJSON(doc, node) {
  return findNodeInJSON(doc, node);
}

export function logNodeFromJSON({ state, props }) {
  const { doc, node } = props;
  const fullDoc = state.get("editor.state").doc;
  const path = findPMNodeInJSON(doc, node);
  if (path) {
    console.log(path.reduce((node, pathItem) => node[pathItem], fullDoc));
  } else {
    console.log(node);
  }
}

export function activatePicker({ state }) {
  function onMouseOver(e) {
    const node = findPMNode(e.target);

    if (
      node &&
      ((node.pmViewDesc.node && node.pmViewDesc.node.type.name !== "doc") ||
        node.pmViewDesc.mark)
    ) {
      const { top, left, width, height } = node.getBoundingClientRect();
      state.set("editor.nodePicker", {
        top: top + window.scrollY,
        left,
        width,
        height,
        onMouseOver,
        onClick
      });
    } else {
      state.set("editor.nodePicker", {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        onMouseOver,
        onClick
      });
    }
  }

  function onClick(e) {
    e.preventDefault();
    document.removeEventListener("mouseover", onMouseOver);
    document.removeEventListener("click", onClick);

    const node = findPMNode(e.target);

    if (node) {
      const editorState = state.get("editor.state");
      const path = findNodeIn(
        editorState.doc,
        editorState.doc.nodeAt(node.pmViewDesc.posAtStart)
      );

      state.set("editor.expandPath", path);
      state.set("tabIndex", 0); // Switch to the "State" tab.
    }

    state.set("editor.nodePicker", { top: 0, left: 0, width: 0, height: 0 });
  }

  document.addEventListener("mouseover", onMouseOver);
  document.addEventListener("click", onClick);

  state.set("editor.nodePicker", {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    onMouseOver,
    onClick
  });
}

export function deactivatePicker({ state }) {
  const picker = state.get("editor.nodePicker");

  if (picker.onMouseOver) {
    document.removeEventListener("mouseover", picker.onMouseOver);
  }

  if (picker.onMouseOver) {
    document.removeEventListener("click", picker.onClick);
  }

  state.set("editor.nodePicker", { top: 0, left: 0, width: 0, height: 0 });
}

export function loadSnapshot(EditorState, { state, props }) {
  const editorView = state.get("editor.view");
  const editorState = editorView.state;

  const newState = EditorState.create({
    schema: editorState.schema,
    plugins: editorState.plugins,
    doc: editorState.schema.nodeFromJSON(props.snapshot.snapshot)
  });

  state.set("editor.history", [createHistoryEntry(null, newState)]);
  state.set("editor.state", newState);
  editorView.updateState(newState);
}

export function saveSnapshot({ state, props }) {
  const snapshots = state.get("editor.snapshots");
  const snapshotName = prompt("Enter snapshot name", Date.now());

  if (!snapshotName) return;

  snapshots.unshift({
    name: snapshotName,
    snapshot: props.snapshot,
    timestamp: Date.now()
  });
  state.set("editor.snapshots", snapshots);

  window.localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
}

export function deleteSnapshot({ state, props }) {
  const snapshots = state.get("editor.snapshots");
  const snapshot = props.snapshot;
  const snapshotIndex = snapshots.indexOf(snapshot);
  snapshots.splice(snapshotIndex, 1);
  state.set("editor.snapshots", snapshots);
  window.localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
}

export function updateActiveMarks({ state, props }) {
  const editorState = props.newState;
  const selection = editorState.selection;
  let marks = [];

  if (selection.empty) {
    marks = selection.storedMarks || selection.$from.marks();
  } else {
    editorState.doc.nodesBetween(selection.from, selection.to, node => {
      marks = marks.concat(node.marks);
    });
  }

  marks = marks
    .reduce((acc, mark) => {
      if (acc.indexOf(mark) === -1) {
        acc.push(mark);
      }
      return acc;
    }, [])
    .map(m => m.toJSON());

  state.set("editor.activeMarks", marks);
}

export default function createEditorModule(editorView, props) {
  const EditorState = getEditorStateClass(props);

  return {
    state: {
      view: editorView,
      state: editorView.state,
      activeMarks: [],
      history: [{ state: editorView.state, timestamp: Date.now() }],
      selectedHistoryItem: 0,
      historyRolledBackTo: false,
      expandPath: [],
      snapshots: JSON.parse(window.localStorage.getItem(SNAPSHOTS_KEY)) || [],
      nodePicker: { top: 0, left: 0, width: 0, height: 0 }
    },
    signals: {
      updated: [
        [updateCurrentEditorState, updateActiveMarks],
        [shrinkEditorHistory, updateEditorHistory]
      ],
      historyItemSelected: selectHistoryItem,
      historyRolledBack: rollbackHistory.bind(null, EditorState),
      pickerActivated: activatePicker,
      pickerDeactivated: deactivatePicker,
      JSONTreeNodeLogged: logNodeFromJSON,
      snapshotLoaded: loadSnapshot.bind(null, EditorState),
      snapshotSaved: saveSnapshot,
      snapshotDeleted: deleteSnapshot
    }
  };
}
