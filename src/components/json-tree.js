import React from "react";
import JSONTreeVendor from "react-json-tree";
import { jsonTreeTheme } from "./../colors";

export default function JSONTree(props) {
  return (
    <JSONTreeVendor
      invertTheme={false}
      theme={jsonTreeTheme}
      hideRoot
      {...props}
    />
  );
}
