import React, { ReactNode, MouseEventHandler } from "react";
import { css } from "@compiled/react";
import theme from "../theme";

type ButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

const buttonStyles = css({
  color: theme.softerMain,
  marginTop: "4px",
  marginBottom: "4px",
  fontWeight: 400,
  fontSize: "12px",
  background: "transparent",
  border: "none",
  "&:hover": {
    background: theme.white10,
  },
});

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button css={buttonStyles} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
