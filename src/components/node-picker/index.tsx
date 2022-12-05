import React from "react";
import styled from "@emotion/styled";
import theme from "../../theme";
import { NodePickerState, useNodePicker } from "../../state/node-picker";
import { useSetAtom } from "jotai";
import { devToolTabIndexAtom } from "../../state/global";

const icon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAQAAAACNCElAAAAxklEQVRIx+2Vuw3DMAxEXWUD9VrKvTYJRzAygWpPkSVcBlDtJS6Fg8AQqQ+lAEECXU08iid+pmnoTwWDKzbU6IEbLnkYQaMlD9uA6iqAUArQwDBgX4T1Z+uF4Q4PB/sZmH/1e1BCRZiLhqgWKsJsYjJLUPkDEJKjvmPWwnwCtcKoW4O5VnpTFmaVb8o3LXONOiZAcI3aYe5UIFXiUmv77doOc7oUpDoozLU5iiPFqYtcW4W01LJP3FEiwzXBLG9SUBNq6Ef0BJ8IApq+rItIAAAAAElFTkSuQmCC";

type NodePickerStyledProps = { nodePicker: NodePickerState };
const NodePickerStyled = styled("div")<NodePickerStyledProps>(
  {
    position: "absolute",
    pointerEvents: "none",
    top: 0,
    left: 0,
    background: "rgba(0, 0, 255, 0.3)",
    zIndex: 99999,
    cursor: "pointer",
  },
  ({ nodePicker }: NodePickerStyledProps) => ({
    transform: `translateX(${nodePicker.left}px) translateY(${nodePicker.top}px)`,
    display: nodePicker.top && nodePicker.left ? "block" : "none",
    width: `${nodePicker.width}px`,
    height: `${nodePicker.height}px`,
  })
);
NodePickerStyled.displayName = "NodePickerStyled";

function NodePicker() {
  const setTabIndex = useSetAtom(devToolTabIndexAtom);
  const [nodePicker, nodePickerApi] = useNodePicker();
  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      nodePickerApi.updatePosition(e.target as HTMLElement);
    },
    [nodePickerApi]
  );
  const handleNodeClick = React.useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      nodePickerApi.select(e.target as HTMLElement);
      setTabIndex("state");
    },
    [nodePickerApi]
  );

  React.useEffect(() => {
    const active = nodePicker.active;
    if (!active) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleNodeClick);
    document.addEventListener("keydown", nodePickerApi.deactivate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleNodeClick);
      document.removeEventListener("keydown", nodePickerApi.deactivate);
    };
  }, [handleMouseMove, handleNodeClick, nodePickerApi, nodePicker.active]);

  return <NodePickerStyled nodePicker={nodePicker} />;
}

type NodePickerTriggerProps = { isActive: boolean };
const NodePickerTrigger = styled("div")<NodePickerTriggerProps>(
  {
    position: "absolute",
    right: "4px",
    top: "-28px",
    width: "24px",
    height: "24px",
    borderRadius: "3px",

    "&:hover": {
      backgroundColor: theme.main80,
      cursor: "pointer",
    },
  },
  ({ isActive }: NodePickerTriggerProps) => ({
    background: `${isActive ? theme.main : theme.main60} url("${icon}")`,
    backgroundSize: "20px 20px",
    backgroundRepeat: "none",
    backgroundPosition: "50% 50%",
  })
);
NodePickerTrigger.displayName = "NodePickerTrigger";

export { NodePicker, NodePickerTrigger };
