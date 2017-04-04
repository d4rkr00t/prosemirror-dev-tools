export function toggleSelection({ state }) {
  state.set(
    "stateTab.selectionExpanded",
    !state.get("stateTab.selectionExpanded")
  );
}

export default function createStateTabModule() {
  return {
    state: {
      selectionExpanded: false
    },
    signals: {
      selectionToggled: toggleSelection
    }
  };
}
