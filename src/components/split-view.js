import glamorous from "glamorous/dist/glamorous.esm.tiny";
import theme from "../theme";

export const SplitView = glamorous("div")({
  display: "flex",
  height: "100%"
});
SplitView.displayName = "SplitView";

export const SplitViewCol = glamorous("div")(
  {
    boxSizing: "border-box",
    height: "100%",
    overflow: "scroll"
  },
  ({ glam: { grow, sep, noPaddings, minWidth, maxWidth } }) => ({
    flexGrow: grow ? 1 : 0,
    borderLeft: sep ? "1px solid " + theme.main20 : "none",
    padding: noPaddings ? "" : "16px 18px 18px",
    minWidth: minWidth ? `${minWidth}px` : "none",
    maxWidth: maxWidth ? `${maxWidth}px` : "none"
  })
);
SplitViewCol.displayName = "SplitViewCol";
