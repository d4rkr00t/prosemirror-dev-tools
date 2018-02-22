import React from "react";
import glamorous from "glamorous/dist/glamorous.esm.tiny";
import SyntaxHighlighter, {
  registerLanguage
} from "react-syntax-highlighter/light";
import htmlLang from "react-syntax-highlighter/languages/hljs/xml";
import colorTheme from "react-syntax-highlighter/styles/hljs/tomorrow-night-blue";

colorTheme.hljs.background = "transparent";

registerLanguage("html", htmlLang);

const CustomPre = glamorous("pre")({
  padding: "9px 0 18px 0 !important",
  margin: 0
});
CustomPre.displayName = "CustomPre";

export function Highlighter(props) {
  if (!props.children) return null;

  return (
    <SyntaxHighlighter PreTag={CustomPre} language="html" style={colorTheme}>
      {props.children}
    </SyntaxHighlighter>
  );
}
