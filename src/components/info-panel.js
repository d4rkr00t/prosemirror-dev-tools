import styled from "@emotion/styled";
import theme from "../theme";

const InfoPanel = styled("div")({
  position: "relative",
  top: "50%",
  transform: "translateY(-50%)",
  textAlign: "center",
  color: theme.main,
  fontSize: "14px",
});
InfoPanel.displayName = "InfoPanel";

export { InfoPanel };
