import React from "react";
import { JSONTree } from "react-json-tree";
import { jsonTreeTheme } from "../theme";

export default function JSONTreeWrapper(props) {
  return (
    <JSONTree invertTheme={false} theme={jsonTreeTheme} hideRoot {...props} />
  );
}
