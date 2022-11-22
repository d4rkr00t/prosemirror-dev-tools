import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import findNodeIn, { findPMNode } from "../utils/find-node";
import { editorStateAtom } from "./editor-state";
import { expandPathAtom } from "./expand-path";

const NODE_PICKER_DEFAULT = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  active: false,
};

const nodePickerAtom = atom(NODE_PICKER_DEFAULT);

// TODO: rewrite as read and write atom
export function useNodePicker() {
  const [nodePickerState, setNodePickerState] = useAtom(nodePickerAtom);
  const editorState = useAtomValue(editorStateAtom);
  const setExpandPath = useSetAtom(expandPathAtom);

  const api = {
    activate: () => {
      setNodePickerState({ ...NODE_PICKER_DEFAULT, active: true });
    },

    deactivate: () => {
      setNodePickerState(NODE_PICKER_DEFAULT);
    },

    select: (target) => {
      const node = findPMNode(target);

      if (node) {
        const path = findNodeIn(
          editorState.doc,
          editorState.doc.nodeAt(node.pmViewDesc.posAtStart)
        );

        setExpandPath(path);
        api.deactivate();
      }
    },

    updatePosition: (target) => {
      const node = findPMNode(target);

      if (
        node &&
        ((node.pmViewDesc.node && node.pmViewDesc.node.type.name !== "doc") ||
          node.pmViewDesc.mark)
      ) {
        const { top, left, width, height } = node.getBoundingClientRect();
        setNodePickerState({
          top: top + window.scrollY,
          left,
          width,
          height,
          active: true,
        });
      } else {
        api.activate();
      }
    },
  };

  return [nodePickerState, api];
}
