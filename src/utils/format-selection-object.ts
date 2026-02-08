import type { Selection } from "prosemirror-state";

const copyProps = [
  "jsonID",
  "empty",
  "anchor",
  "from",
  "head",
  "to",
  "$anchor",
  "$head",
  "$cursor",
  "$to",
  "$from",
];

const copySubProps = {
  $from: ["nodeAfter", "nodeBefore", "parent", "textOffset", "depth", "pos"],
  $to: ["nodeAfter", "nodeBefore", "parent", "textOffset", "depth", "pos"],
};

const isNode = ["nodeAfter", "nodeBefore", "parent"];

function filterProps(
  selection: Selection,
  props: Array<string>,
  subProps?: Record<string, Array<string>>,
) {
  return props.reduce<Record<string, any>>((acc, prop) => {
    if (subProps && subProps[prop]) {
      acc[prop] = subProps[prop].reduce<Record<string, any>>(
        (subAcc, subProp) => {
          subAcc[subProp] =
            isNode.indexOf(subProp) === -1 || !(selection as any)[prop][subProp]
              ? (selection as any)[prop][subProp]
              : (selection[prop as keyof Selection] as any)[subProp].toJSON();
          return subAcc;
        },
        {},
      );
    } else {
      acc[prop === "jsonID" ? "type" : prop] =
        selection[prop as keyof Selection];
    }

    return acc;
  }, {});
}

export function expandedStateFormatSelection(selection: Selection) {
  return filterProps(selection, copyProps, copySubProps);
}

export function collapsedStateFormatSelection(selection: Selection) {
  return filterProps(selection, copyProps.slice(0, 6));
}
