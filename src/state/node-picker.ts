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

export type NodePickerState = {
  top: number;
  left: number;
  width: number;
  height: number;
  active: boolean;
};
const nodePickerAtom = atom<NodePickerState>(NODE_PICKER_DEFAULT);

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

    select: (target: HTMLElement) => {
      if (!editorState) return;
      const node = findPMNode(target);

      if (node) {
        const path = findNodeIn(
          editorState.doc,
          editorState.doc.nodeAt(node.pmViewDesc!.posAtStart)!
        );

        if (!path) return;

        setExpandPath([]);
        setExpandPath(path);
        api.deactivate();
      }
    },

    updatePosition: (target: HTMLElement) => {
      const node = findPMNode(target);

      if (
        node &&
        ((node.pmViewDesc!.node && node.pmViewDesc!.node.type.name !== "doc") ||
          (node.pmViewDesc! as any).mark)
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

  return [nodePickerState, api] as const;
}
