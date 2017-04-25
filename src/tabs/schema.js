import React from "react";
import { NodeType, MarkType } from "prosemirror-model";
import { connect } from "cerebral/react";
import { state } from "cerebral/tags";
import isPlainObject from "lodash/isPlainObject";

import { SplitView, SplitViewCol } from "../components/split-view";
import JSONTree from "../components/json-tree";
import { Heading } from "./../components/heading";

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

export default connect(
  {
    state: state`editor.state`
  },
  function SchemaView({ state }) {
    return (
      <SplitView>
        <SplitViewCol grow>
          <Heading>Nodes</Heading>
          <JSONTree
            data={state.schema.nodes}
            postprocessValue={postprocessValue.bind(null, ignoreFields)}
          />
        </SplitViewCol>
        <SplitViewCol grow sep>
          <Heading>Marks</Heading>
          <JSONTree
            data={state.schema.marks}
            postprocessValue={postprocessValue.bind(null, ignoreFields)}
          />
        </SplitViewCol>
      </SplitView>
    );
  }
);
