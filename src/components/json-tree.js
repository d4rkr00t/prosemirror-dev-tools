import React from "react";
import JSONTreeVendor from "react-json-tree";
import { jsonTreeTheme } from "./../theme";

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
