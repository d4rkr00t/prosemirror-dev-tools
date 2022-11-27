import { prettyPrint } from "html";
import { atom } from "jotai";
import { nanoid } from "nanoid";
import { DOMSerializer } from "prosemirror-model";
import type { EditorState, Selection, Transaction } from "prosemirror-state";
import type { JsonDiffMain } from "./json-diff-main";
import type { JsonDiffWorker } from "./json-diff-worker";

const HISTORY_SIZE = 200;

export const historyAtom = atom<Array<HistoryItem>>([]);
export const historyRolledBackToAtom = atom<null | number>(null);
export const historyDiffsAtom = atom<
  Record<string, { diff: unknown; selection: unknown }>
>({});

type HistoryAction =
  | { type: "reset"; payload: { state: EditorState } }
  | {
      type: "update";
      payload: {
        newState: EditorState;
        tr: Transaction;
        oldState: EditorState;
        diffWorker: Promise<JsonDiffMain | JsonDiffWorker>;
      };
    };
export const historyWriteAtom = atom(
  null,
  async (get, set, action: HistoryAction) => {
    if (action.type === "reset") {
      set(historyAtom, [
        {
          id: nanoid(),
          state: action.payload.state,
          timestamp: Date.now(),
          diffPending: false,
          diff: null,
          selectionContent: [],
        },
      ]);
      set(historyRolledBackToAtom, null);
      set(historyDiffsAtom, {});
      return;
    }

    if (action.type === "update") {
      const rolledBackTo = get(historyRolledBackToAtom);
      const history = get(historyAtom);

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

      if (rolledBackTo !== null) {
        const historyDiff = get(historyDiffsAtom);
        set(historyRolledBackToAtom, null);
        const newDiffs = updatedHistory.reduce<
          Record<string, { diff: unknown; selection: unknown }>
        >((acc, item) => {
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
  }
);

export function buildSelection(selection: Selection) {
  return {
    empty: selection.empty,
    anchor: selection.anchor,
    head: selection.head,
    from: selection.from,
    to: selection.to,
  };
}

export function createHistoryEntry(editorState: EditorState): HistoryItem {
  const serializer = DOMSerializer.fromSchema(editorState.schema);
  const selection = editorState.selection;
  const domFragment = serializer.serializeFragment(selection.content().content);

  const selectionContent: Array<string> = [];
  if (domFragment) {
    let child = domFragment.firstChild;
    while (child) {
      selectionContent.push((child as HTMLElement).outerHTML);
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

export function shrinkEditorHistory(
  history: Array<HistoryItem>,
  historyRolledBackTo: number | null
) {
  const startIndex = historyRolledBackTo !== null ? historyRolledBackTo : 0;
  return history.slice(startIndex, HISTORY_SIZE);
}

export function updateEditorHistory(
  history: Array<HistoryItem>,
  historyRolledBackTo: null | number,
  tr: Transaction,
  newState: EditorState
) {
  const skipHistory = tr.getMeta("_skip-dev-tools-history_");

  if (skipHistory) return;

  const newHistory = shrinkEditorHistory(history, historyRolledBackTo);
  newHistory.unshift(createHistoryEntry(newState));
  return newHistory;
}

export type HistoryItem = {
  id: string;
  index?: number;
  state: EditorState;
  timestamp: number;
  diffPending: boolean;
  diff: unknown;
  selection?: Selection;
  selectionContent: string | Array<string>;
};
