import glamorous from "glamorous/dist/glamorous.esm.tiny";

const CSSReset = glamorous("div")({
  fontSize: "100%",
  lineHeight: 1,

  "& li + li": {
    margin: 0
  }
});
CSSReset.displayName = "CSSReset";

export default CSSReset;
