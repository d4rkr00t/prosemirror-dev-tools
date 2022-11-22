import { atomWithStorage, useReducerAtom } from "jotai/utils";

const SNAPSHOTS_KEY = "prosemirror-dev-tools-snapshots";
const snapshotsAtom = atomWithStorage(SNAPSHOTS_KEY, []);

function snapshotReducer(prev, action) {
  if (action.type === "save") {
    const snapshots = [action.payload.snapshot].concat(prev);
    return snapshots;
  } else if (action.type === "delete") {
    return prev.filter((item) => item !== action.payload.snapshot);
  }
  return prev;
}

export function useSnapshots() {
  return useReducerAtom(snapshotsAtom, snapshotReducer);
}
