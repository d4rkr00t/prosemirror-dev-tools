import type { Fragment, Node } from "prosemirror-model";
import type { Selection } from "prosemirror-state";

export type JSONNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: Array<JSONNode>;
  text?: string;
};

export type JSONMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type ExtendedFragment = Fragment & {
  content?: Array<Node>;
};
