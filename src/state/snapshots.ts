import { atomWithStorage, useReducerAtom } from "jotai/utils";

const SNAPSHOTS_KEY = "prosemirror-dev-tools-snapshots";
const snapshotsAtom = atomWithStorage<Array<Snapshot>>(SNAPSHOTS_KEY, []);

type SnapshotReducerAction =
  | { type: "save"; payload: { snapshot: Snapshot } }
  | { type: "delete"; payload: { snapshot: Snapshot } };

export type Snapshot = {
  name: string;
  timestamp: number;
  snapshot: any;
};

function snapshotReducer(prev: Array<Snapshot>, action: SnapshotReducerAction) {
  if (action.type === "save") {
    const snapshots = [action.payload.snapshot].concat(prev);
    return snapshots;
  } else if (action.type === "delete") {
    return prev.filter((item) => item !== action.payload.snapshot);
  }
  return prev;
}

export function useSnapshots() {
  return useReducerAtom<Array<Snapshot>, SnapshotReducerAction>(
    snapshotsAtom,
    snapshotReducer,
  );
}
