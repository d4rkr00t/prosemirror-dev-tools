import React from "react";
import styled from "styled-components";
import SyntaxHighlighter, {
  registerLanguage
} from "react-syntax-highlighter/light";
import htmlLang from "react-syntax-highlighter/languages/hljs/xml";
import colorTheme from "react-syntax-highlighter/styles/hljs/tomorrow-night-blue";

colorTheme.hljs.background = "transparent";

registerLanguage("html", htmlLang);

const CustomPre = styled.pre`
  padding: 9px 0 18px 0 !important;
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
