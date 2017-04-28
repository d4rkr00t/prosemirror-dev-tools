import React from "react";
import styled from "styled-components";
import SyntaxHighlighter, {
  registerLanguage
} from "react-syntax-highlighter/dist/light";
import htmlLang from "highlight.js/lib/languages/xml";
import colorTheme
  from "react-syntax-highlighter/dist/styles/tomorrow-night-blue";

colorTheme.hljs.background = "transparent";

registerLanguage("html", htmlLang);

const CustomPre = styled.pre`
  white-space: pre-line;
  padding: 9px 0 0 0 !important;
  margin: 0;
`;

export function Highlighter(props) {
  if (!props.children) return null;

  return (
    <SyntaxHighlighter PreTag={CustomPre} language="html" style={colorTheme}>
      {props.children}
    </SyntaxHighlighter>
  );
}
