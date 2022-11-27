import React from "react";
import styled from "@emotion/styled";
import theme from "../theme";

const CustomPre = styled("pre")({
  padding: "9px 0 18px 0 !important",
  margin: 0,
  color: theme.white80,
  "& .prosemirror-dev-tools-highlighter-tag": {
    color: theme.main,
  },
});
CustomPre.displayName = "CustomPre";

const regexp = /(&lt;\/?[\w\d\s="']+&gt;)/gim;
const highlight = (str: string) =>
  str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      regexp,
      "<span class='prosemirror-dev-tools-highlighter-tag'>$&</span>"
    );

type HighlighterFC = React.FC<{ children: string }>;
export const Highlighter: HighlighterFC = (props) => {
  if (!props.children) return null;
  return (
    <CustomPre
      dangerouslySetInnerHTML={{
        __html: highlight(props.children),
      }}
    />
  );
};
