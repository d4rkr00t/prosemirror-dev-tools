import { DOMSerializer } from "prosemirror-model";
import { Container } from "unstated";
import { prettyPrint } from "html";
import nanoid from "nanoid";
import subscribeOnUpdates from "../utils/subscribe-on-updates";
import findNodeIn, { findNodeInJSON } from "../utils/find-node";
import getEditorStateClass from "./get-editor-state";

const NODE_PICKER_DEFAULT = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  active: false,
};
const HISTORY_SIZE = 200;
const SNAPSHOTS_KEY = "prosemirror-dev-tools-snapshots";
const nodesColors = [
  "#EA7C7F", // red
  "#67B0C6", // cyan 400
  "#94BB7F", // green
  "#CA9EDB", // deep purple
  "#DCDC5D", // lime
  "#B9CC7C", // light green
  "#DD97D8", // purple
  "#FFB761", // orange
  "#4D8FD1", // light blue
  "#F36E98", // pink
  "#E45F44", // deep orange
  "#A6A4AE", // blue grey
  "#FCC047", // yellow
  "#FFC129", // amber
  "#D3929C", // can can
  "#4CBCD4", // cyan
  "#8D7BC0", // indigo
];

export function calculateSafeIndex(index, total) {
  const quotient = index / total;
  return Math.round(total * (quotient - Math.floor(quotient)));
}

export function buildColors(schema) {
  return Object.keys(schema.nodes).reduce((acc, node, index) => {
    const safeIndex =
      index >= nodesColors.length
        ? calculateSafeIndex(index, nodesColors.length)
        : index;

    acc[node] = nodesColors[safeIndex];
    return acc;
  }, {});
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

export function getActiveMarks(editorState) {
  const selection = editorState.selection;
  let marks = [];

  if (selection.empty) {
    marks = selection.storedMarks || selection.$from.marks();
  } else {
    editorState.doc.nodesBetween(selection.from, selection.to, (node) => {
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
    .map((m) => m.toJSON());

  return marks;
}

export function buildSelection(selection) {
  return {
    type: selection.type,
    empty: selection.empty,
    anchor: selection.anchor,
    head: selection.head,
    from: selection.from,
    to: selection.to,
  };
}

export function createHistoryEntry(editorState) {
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
    id: nanoid(),
    state: editorState,
    timestamp: Date.now(),
    diffPending: true,
    diff: undefined,
    selection: undefined,
    selectionContent: prettyPrint(selectionContent.join("\n"), {
      max_char: 60,
      indent_size: 2,
    }),
  };
}

export function shrinkEditorHistory(history, historyRolledBackTo) {
  const startIndex = historyRolledBackTo !== false ? historyRolledBackTo : 0;
  return history.slice(startIndex, HISTORY_SIZE);
}

export function updateEditorHistory(
  history,
  historyRolledBackTo,
  tr,
  newState
) {
  const skipHistory = tr.getMeta("_skip-dev-tools-history_");

  if (skipHistory) return;

  const newHistory = shrinkEditorHistory(history, historyRolledBackTo);
  newHistory.unshift(createHistoryEntry(newState));
  return newHistory;
}

export default class EditorStateContainer extends Container {
  state = {
    EditorState: function () {},
    view: null,
    state: {},
    schema: {},
    nodeColors: {},
    activeMarks: [],
    history: [],
    expandPath: [],
    historyRolledBackTo: false,
    selectedHistoryItem: 0,
    snapshots: JSON.parse(window.localStorage.getItem(SNAPSHOTS_KEY)) || [],
    nodePicker: NODE_PICKER_DEFAULT,
  };

  constructor(editorView, props) {
    super();

    this.diffWorker =
      props && props.diffWorker
        ? import("./json-diff-worker").then(
            ({ JsonDiffWorker }) => new JsonDiffWorker(props.diffWorker)
          )
        : import("./json-diff-main").then(
            ({ JsonDiffMain }) => new JsonDiffMain()
          );

    this.state = Object.assign({}, this.state, {
      EditorState: getEditorStateClass(props),
      view: editorView,
      state: editorView.state,
      nodeColors: buildColors(editorView.state.schema),
      history: [{ state: editorView.state, timestamp: Date.now() }],
    });

    subscribeOnUpdates(editorView, (tr, oldState, newState) => {
      const updatedHistory = updateEditorHistory(
        this.state.history,
        this.state.historyRolledBackTo,
        tr,
        newState
      );

      if (oldState && updatedHistory) {
        const [{ id }] = updatedHistory;
        const self = this;

        (async () => {
          const diffWorker = await this.diffWorker;

          const [{ delta: diff }, { delta: selection }] = await Promise.all([
            diffWorker.diff({
              a: oldState.doc.toJSON(),
              b: newState.doc.toJSON(),
              id,
            }),
            diffWorker.diff({
              a: buildSelection(oldState.selection),
              b: buildSelection(newState.selection),
              id,
            }),
          ]);

          const history = updatedHistory.map((item) => {
            return item.id === id
              ? Object.assign({}, item, { diff, diffPending: false, selection })
              : item;
          });

          self.setState({
            history,
          });
        })();
      }

      this.setState({
        state: newState,
        nodeColors: buildColors(newState.schema),
        activeMarks: getActiveMarks(newState),
        history: updatedHistory || this.state.history,
        selectedHistoryItem: updatedHistory
          ? 0
          : this.state.selectedHistoryItem,
        historyRolledBackTo: updatedHistory
          ? false
          : this.state.historyRolledBackTo,
      });
    });
  }

  activatePicker = () => {
    this.setState({
      nodePicker: Object.assign({}, NODE_PICKER_DEFAULT, { active: true }),
    });
  };

  deactivatePicker = () => {
    const picker = this.state.nodePicker;

    if (picker.onMouseOver) {
      document.removeEventListener("mouseover", picker.onMouseOver);
    }

    if (picker.onMouseOver) {
      document.removeEventListener("click", picker.onClick);
    }

    this.setState({ nodePicker: NODE_PICKER_DEFAULT });
  };

  updateNodePickerPossition = (target) => {
    const node = findPMNode(target);

    if (
      node &&
      ((node.pmViewDesc.node && node.pmViewDesc.node.type.name !== "doc") ||
        node.pmViewDesc.mark)
    ) {
      const { top, left, width, height } = node.getBoundingClientRect();
      this.setState({
        nodePicker: {
          top: top + window.scrollY,
          left,
          width,
          height,
          active: true,
        },
      });
    } else {
      this.setState({
        nodePicker: Object.assign({}, NODE_PICKER_DEFAULT, { active: true }),
      });
    }
  };

  nodePickerSelect = (target) => {
    const node = findPMNode(target);

    if (node) {
      const editorState = this.state.state;
      const path = findNodeIn(
        editorState.doc,
        editorState.doc.nodeAt(node.pmViewDesc.posAtStart)
      );

      this.setState({ expandPath: path });
    }

    this.setState({ nodePicker: NODE_PICKER_DEFAULT });
  };

  saveSnapshot = () => {
    const snapshotName = prompt("Enter snapshot name", Date.now());

    if (!snapshotName) return;

    const snapshots = [
      {
        name: snapshotName,
        timestamp: Date.now(),
        snapshot: this.state.state.doc.toJSON(),
      },
    ].concat(this.state.snapshots);

    this.setState({ snapshots });

    window.localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
  };

  loadSnapshot = (snapshot) => {
    const EditorState = this.state.EditorState;
    const editorView = this.state.view;
    const editorState = editorView.state;

    const newState = EditorState.create({
      schema: editorState.schema,
      plugins: editorState.plugins,
      doc: editorState.schema.nodeFromJSON(snapshot.snapshot),
    });

    this.setState({
      history: [createHistoryEntry(newState)],
      state: newState,
    });

    editorView.updateState(newState);
  };

  deleteSnapshot = (snapshot) => {
    const snapshots = this.state.snapshots;
    const snapshotIndex = snapshots.indexOf(snapshot);
    snapshots.splice(snapshotIndex, 1);
    this.setState({ snapshots: [].concat(snapshots) });
    window.localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
  };

  logNodeFromJSON = ({ doc, node }) => {
    const fullDoc = this.state.state.doc;
    const path = findNodeInJSON(doc, node);
    if (path) {
      console.log(path.reduce((node, pathItem) => node[pathItem], fullDoc));
    } else {
      console.log(node);
    }
  };

  selectHistoryItem = (index) => this.setState({ selectedHistoryItem: index });

  rollbackHistory = (index) => {
    const EditorState = this.state.EditorState;
    const { state: editorState } = this.state.history[index];
    const editorView = this.state.view;

    const newState = EditorState.create({
      schema: editorState.schema,
      plugins: editorState.plugins,
      doc: editorState.schema.nodeFromJSON(editorState.doc.toJSON()),
    });

    editorView.updateState(newState);
    editorView.dom.focus();
    const tr = editorView.state.tr
      .setSelection(editorState.selection)
      .setMeta("addToHistory", false)
      .setMeta("_skip-dev-tools-history_", true);

    editorView.dispatch(tr);

    this.setState({
      state: newState,
      historyRolledBackTo: index,
    });
  };
}
