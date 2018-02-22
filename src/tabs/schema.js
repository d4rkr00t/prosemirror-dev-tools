import React from "react";
import { Subscribe } from "unstated";
import EditorStateContainer from "../state/editor";
import { SplitView, SplitViewCol } from "../components/split-view";
import JSONTree from "../components/json-tree";
import { Heading } from "./../components/heading";

const ignoreFields = ["schema", "contentExpr", "schema", "parseDOM", "toDOM"];

export function postprocessValue(ignore, data) {
  if (!data || Object.prototype.toString.call(data) !== "[object Object]")
    return data;

  return Object.keys(data)
    .filter(key => ignore.indexOf(key) === -1)
    .reduce((res, key) => {
      res[key] = data[key];
      return res;
    }, {});
}

export default function SchemaView() {
  return (
    <Subscribe to={[EditorStateContainer]}>
      {({ state: { state } }) => {
        return (
          <SplitView>
            <SplitViewCol glam={{ grow: true }}>
              <Heading>Nodes</Heading>
              <JSONTree
                data={state.schema.nodes}
                postprocessValue={postprocessValue.bind(null, ignoreFields)}
              />
            </SplitViewCol>
            <SplitViewCol glam={{ grow: true, sep: true }}>
              <Heading>Marks</Heading>
              <JSONTree
                data={state.schema.marks}
                postprocessValue={postprocessValue.bind(null, ignoreFields)}
              />
            </SplitViewCol>
          </SplitView>
        );
      }}
    </Subscribe>
  );
}
