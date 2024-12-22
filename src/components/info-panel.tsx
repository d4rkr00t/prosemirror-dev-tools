import React from "react";
import { css } from "@compiled/react";
import theme from "../theme";

const infoPanelStyles = css({
  position: "relative",
  top: "50%",
  transform: "translateY(-50%)",
  textAlign: "center",
  color: theme.main,
  fontSize: "14px",
});
const InfoPanel: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div css={infoPanelStyles}>{children}</div>
);

export { InfoPanel };
