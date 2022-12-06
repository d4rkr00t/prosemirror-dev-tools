import React from "react";
import { css } from "@compiled/react";
import theme from "../theme";

const customPreStyles = css({
  padding: "9px 0 18px 0 !important",
  margin: 0,
  color: theme.white80,
  "& .prosemirror-dev-tools-highlighter-tag": {
    color: theme.main,
  },
});
const CustomPre: React.FC<{ __html: string }> = ({ children, __html }) => (
  <pre css={customPreStyles} dangerouslySetInnerHTML={{ __html }}>
    {children}
  </pre>
);

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
  return <CustomPre __html={highlight(props.children)} />;
};
