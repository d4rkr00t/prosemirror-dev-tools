import React from "react";
import { css } from "@compiled/react";

const cssResetStyles = css({
  fontSize: "100%",
  lineHeight: 1,

  "& li + li": {
    margin: 0,
  },
});

const CSSReset: React.FC = ({ children }) => {
  return <div css={cssResetStyles}>{children}</div>;
};

export default CSSReset;
