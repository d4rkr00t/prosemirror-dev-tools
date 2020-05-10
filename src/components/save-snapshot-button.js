import styled from "@emotion/styled";
import theme from "../theme";

const SaveSnapshotButton = styled("div")({
  position: "absolute",
  right: "32px",
  top: "-28px",
  color: theme.white,
  background: theme.main60,
  fontSize: "12px",
  lineHeight: "25px",
  padding: "0 6px",
  height: "24px",
  backgroundSize: "20px 20px",
  backgroundRepeat: "none",
  backgroundPosition: "50% 50%",
  borderRadius: "3px",

  "&:hover": {
    backgroundColor: theme.main80,
    cursor: "pointer",
  },
});
SaveSnapshotButton.displayName = "SaveSnapshotButton";

export default SaveSnapshotButton;
