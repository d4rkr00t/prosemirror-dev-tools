import glamorous from "glamorous/dist/glamorous.esm.tiny";
import theme from "../theme";

const InfoPanel = glamorous("div")({
  position: "relative",
  top: "50%",
  transform: "translateY(-50%)",
  textAlign: "center",
  color: theme.main,
  fontSize: "14px"
});
InfoPanel.displayName = "InfoPanel";

export { InfoPanel };
