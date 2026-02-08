import React, { MouseEventHandler } from "react";
import { css } from "@compiled/react";
import theme from "../theme";

const headingStyles = css({
  color: theme.softerMain,
  padding: 0,
  margin: 0,
  fontWeight: 400,
  letterSpacing: "1px",
  fontSize: "13px",
  textTransform: "uppercase",
  flexGrow: 1,
});
const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 css={headingStyles}>{children}</h2>
);

const headingWithButtonStyles = css({ display: "flex" });
const HeadingWithButton = ({ children }: { children: React.ReactNode }) => (
  <div css={headingWithButtonStyles}>{children}</div>
);

const headingButtonStyles = css({
  padding: "6px 10px",
  margin: "-6px -10px 0 8px",
  fontWeight: 400,
  letterSpacing: "1px",
  fontSize: "11px",
  color: theme.white80,
  textTransform: "uppercase",
  transition: "background 0.3s, color 0.3s",
  borderRadius: "2px",
  border: "none",
  background: "transparent",

  "&:hover": {
    background: theme.main40,
    color: theme.text,
    cursor: "pointer",
  },

  "&:focus": {
    outline: "none",
  },

  "&:active": {
    background: theme.main60,
  },
});
const HeadingButton = ({
  children,
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <button onClick={onClick} css={headingButtonStyles}>
    {children}
  </button>
);

export { Heading, HeadingWithButton, HeadingButton };
