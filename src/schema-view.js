import React from "react";
import { NodeType, MarkType } from "prosemirror-model";
import { SplitView, SplitViewCol } from "./split-view";
import JSONTree from "./json-tree";
import { Heading } from "./components/heading";
import isPlainObject from "lodash/isPlainObject";

const ignoreFields = ["schema", "contentExpr", "schema", "parseDOM", "toDOM"];

export function postprocessValue(ignore, data) {
  if (
    !isPlainObject(data) &&
    !(data instanceof NodeType) &&
    !(data instanceof MarkType)
  )
    return data;

  return Object.keys(data).filter(key => ignore.indexOf(key) === -1).reduce((
    res,
    key
  ) => {
    res[key] = data[key];
    return res;
  }, {});
}

export default function SchemaView(props) {
  return (
    <SplitView>
      <SplitViewCol grow>
        <Heading>Nodes</Heading>
        <JSONTree
          data={props.schema.nodes}
          postprocessValue={postprocessValue.bind(null, ignoreFields)}
        />
      </SplitViewCol>
      <SplitViewCol grow sep>
        <Heading>Marks</Heading>
        <JSONTree
          data={props.schema.marks}
          postprocessValue={postprocessValue.bind(null, ignoreFields)}
        />
      </SplitViewCol>
    </SplitView>
  );
}
