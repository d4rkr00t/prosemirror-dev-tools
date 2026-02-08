import { atom } from "jotai";
import type { Schema } from "prosemirror-model";
import { editorStateAtom } from "./editor-state";

export const nodeColorsAtom = atom((get) => {
  const editorState = get(editorStateAtom);
  if (!editorState) return {};
  return buildColors(editorState.schema);
});

const nodesColors = [
  "#F38BA8", // red
  "#74C7EC", // cyan 400
  "#A6E3A1", // green
  "#CA9EDB", // deep purple
  "#DCDC5D", // lime
  "#B9CC7C", // light green
  "#FAB387", // orange
  "#89B4FA", // light blue
  "#F36E98", // pink
  "#E45F44", // deep orange
  "#DD97D8", // purple
  "#A6A4AE", // blue grey
  "#F9E2AF", // yellow
  "#FFC129", // amber
  "#EBA0AC", // can can
  "#89DCEB", // cyan
  "#B4BEFE", // indigo
];

function calculateSafeIndex(index: number, total: number) {
  const quotient = index / total;
  return Math.round(total * (quotient - Math.floor(quotient)));
}

function buildColors(schema: Schema) {
  return Object.keys(schema.nodes).reduce<Record<string, string>>(
    (acc, node, index) => {
      const safeIndex =
        index >= nodesColors.length
          ? calculateSafeIndex(index, nodesColors.length)
          : index;

      acc[node] = nodesColors[safeIndex];
      return acc;
    },
    {},
  );
}
