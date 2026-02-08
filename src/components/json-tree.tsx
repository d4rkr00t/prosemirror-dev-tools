import type { Mark, MarkType, NodeType } from "prosemirror-model";
import React from "react";
import { JSONTree } from "react-json-tree";
import { jsonTreeTheme } from "../theme";
import { JSONNode } from "../types/prosemirror";

type GetItemString = (
  nodeType: string,
  data: any,
  itemType: React.ReactNode,
  itemString: string,
  keyPath: (string | number)[],
) => React.ReactNode | string;
type JSONTreeProps = {
  data: JSONNode | Record<string, NodeType> | Record<string, MarkType> | Array<Mark>;
  hideRoot?: boolean;
  getItemString?: GetItemString;
  shouldExpandNode?: (nodePath: Array<string | number>) => boolean;
  postprocessValue?: (data: Record<string, unknown>) => Record<string, unknown>;
  valueRenderer?: (value: any) => string | React.ReactNode;
  labelRenderer?: ([label]: (string | number)[]) => React.ReactNode;
  isCustomNode?: (node: any) => boolean;
  sortObjectKeys?: boolean | ((...args: any[]) => any);
};
export default function JSONTreeWrapper(props: JSONTreeProps) {
  return <JSONTree invertTheme={false} theme={jsonTreeTheme} hideRoot {...(props as any)} />;
}
