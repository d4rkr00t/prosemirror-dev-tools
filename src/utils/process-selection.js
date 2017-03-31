const copyProps = [
  "$anchor",
  "$head",
  "$cursor",
  "$to",
  "$from",
  "anchor",
  "empty",
  "from",
  "head",
  "to",
  "jsonID"
];

const copySubProps = {
  $from: ["nodeAfter", "nodeBefore", "parent", "textOffset", "depth"],
  $to: ["nodeAfter", "nodeBefore", "parent", "textOffset", "depth"]
};

const isNode = ["nodeAfter", "nodeBefore", "parent"];

export default function processSelection(selection) {
  return copyProps.reduce(
    (acc, prop) => {
      if (copySubProps[prop]) {
        acc[prop] = copySubProps[prop].reduce(
          (subAcc, subProp) => {
            subAcc[subProp] = isNode.indexOf(subProp) === -1 ||
              !selection[prop][subProp]
              ? selection[prop][subProp]
              : selection[prop][subProp].toJSON();
            return subAcc;
          },
          {}
        );
      } else {
        acc[prop === "jsonID" ? "type" : prop] = selection[prop];
      }

      return acc;
    },
    {}
  );
}
