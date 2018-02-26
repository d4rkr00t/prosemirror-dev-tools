import React from "react";
import { Subscribe } from "unstated";
import EditorStateContainer from "../state/editor";
import { SplitView, SplitViewCol } from "../components/split-view";
import JSONTree from "../components/json-tree";
import { Heading } from "./../components/heading";

const ignoreFields = ["schema", "contentExpr", "schema", "parseDOM", "toDOM"];

export function postprocessValue(ignore, data) {
  if (!data || Object.prototype.toString.call(data) !== "[object Object]") {
    return data;
  }

  return Object.keys(data)
    .filter(key => ignore.indexOf(key) === -1)
    .reduce((res, key) => {
      res[key] = data[key];
      return res;
    }, {});
}

export class SchemaTab extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.schema !== nextProps.schema;
  }

  render() {
    const { schema } = this.props;
    return (
      <SplitView>
        <SplitViewCol grow>
          <Heading>Nodes</Heading>
          <JSONTree
            data={schema.nodes}
            postprocessValue={postprocessValue.bind(null, ignoreFields)}
          />
        </SplitViewCol>
        <SplitViewCol grow sep>
          <Heading>Marks</Heading>
          <JSONTree
            data={schema.marks}
            postprocessValue={postprocessValue.bind(null, ignoreFields)}
          />
        </SplitViewCol>
      </SplitView>
    );
  }
}

export default function SchemaTabContainer() {
  return (
    <Subscribe to={[EditorStateContainer]}>
      {({ state: { state: { schema } } }) => <SchemaTab schema={schema} />}
    </Subscribe>
  );
}
