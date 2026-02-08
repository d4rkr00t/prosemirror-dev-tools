import React from "react";
import { SplitView, SplitViewCol } from "../components/split-view";
import JSONTree from "../components/json-tree";
import { Heading } from "../components/heading";
import { useAtomValue } from "jotai";
import { schemaAtom } from "../state/schema";

const ignoreFields = ["schema", "contentExpr", "schema", "parseDOM", "toDOM"];

export function postprocessValue(
  ignore: Array<string>,
  data: Record<string, unknown>,
) {
  if (!data || Object.prototype.toString.call(data) !== "[object Object]") {
    return data;
  }

  return Object.keys(data)
    .filter((key) => ignore.indexOf(key) === -1)
    .reduce(
      (res, key) => {
        res[key] = data[key];
        return res;
      },
      {} as Record<string, unknown>,
    );
}

export default function SchemaTab() {
  const schema = useAtomValue(schemaAtom);
  if (!schema) return null;

  return (
    <SplitView testId="__prosemirror_devtools_tabs_schema__">
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
