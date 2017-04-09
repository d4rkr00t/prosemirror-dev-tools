import React from "react";
import JSONTreeVendor from "react-json-tree";

const theme = {
  scheme: "monokai",
  base00: "#363755",
  base01: "#604D49",
  base02: "#6D5A55",
  base03: "#D1929B",
  base04: "#B79F8D",
  base05: "#F9F8F2",
  base06: "#F7F4F1",
  base07: "#FAF8F5",
  base08: "#FA3E7E",
  base09: "#FD993C",
  base0A: "#F6BF81",
  base0B: "#B8E248",
  base0C: "#B4EFE4",
  base0D: "#85D9EF",
  base0E: "#BE87FF",
  base0F: "#D6724C"
};

export default function JSONTree(props) {
  return (
    <JSONTreeVendor invertTheme={false} theme={theme} hideRoot {...props} />
  );
}
