import { atom } from "jotai";
import { DOMSerializer } from "prosemirror-model";
import { prettyPrint } from "html";
import { nanoid } from "nanoid";

const HISTORY_SIZE = 200;

export const historyAtom = atom([]);
export const historyRolledBackToAtom = atom(false);
export const historyDiffsAtom = atom({});
export const historyWriteAtom = atom(null, async (get, set, action) => {
  if (action.type === "reset") {
    set(historyAtom, [{ state: action.payload.state, timestamp: Date.now() }]);
    set(historyRolledBackToAtom, false);
    set(historyDiffsAtom, {});
    return;
  }

  if (action.type === "update") {
    const rolledBackTo = get(historyRolledBackToAtom);
    let history = get(historyAtom);

    // TODO: figure out why this is called 2 times
    if (history[0].state === action.payload.newState) {
      return;
    }

    const { oldState, newState, tr } = action.payload;
    const updatedHistory = updateEditorHistory(
      [...history],
      rolledBackTo,
      tr,
      newState
    );
    if (!updatedHistory) {
      return;
    }
    set(historyAtom, updatedHistory);

    if (rolledBackTo !== false) {
      const historyDiff = get(historyDiffsAtom);
      set(historyRolledBackToAtom, false);
      const newDiffs = updatedHistory.reduce((acc, item) => {
        acc[item.id] = historyDiff[item.id];
        return acc;
      }, {});
      // TODO: cleanup diffs
      set(historyDiffsAtom, newDiffs);
    }

    const historyDiff = get(historyDiffsAtom);
    const [{ id }] = updatedHistory;
    const diffWorker = await action.payload.diffWorker;
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
    set(historyDiffsAtom, { ...historyDiff, [id]: { diff, selection } });
  }
});

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
