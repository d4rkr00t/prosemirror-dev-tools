import styled from "@emotion/styled";
import theme from "../theme";

const Heading = styled("h2")({
  color: theme.softerMain,
  padding: 0,
  margin: 0,
  fontWeight: 400,
  letterSpacing: "1px",
  fontSize: "13px",
  textTransform: "uppercase",
  flexGrow: 1,
});
Heading.displayName = "Heading";

const HeadingWithButton = styled("div")({
  display: "flex",
});
HeadingWithButton.displayName = "HeadingWithButton";

const HeadingButton = styled("button")({
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
    color: theme.white,
    cursor: "pointer",
  },

  "&:focus": {
    outline: "none",
  },

  "&:active": {
    background: theme.main60,
  },
});
HeadingButton.displayName = "HeadingButton";

export { Heading, HeadingWithButton, HeadingButton };
