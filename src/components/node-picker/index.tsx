import React, { MouseEventHandler } from "react";
import "@compiled/react";
import { useSetAtom } from "jotai";
import theme from "../../theme";
import { useNodePicker } from "../../state/node-picker";
import { devToolTabIndexAtom } from "../../state/global";

const icon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAQAAAACNCElAAAAxklEQVRIx+2Vuw3DMAxEXWUD9VrKvTYJRzAygWpPkSVcBlDtJS6Fg8AQqQ+lAEECXU08iid+pmnoTwWDKzbU6IEbLnkYQaMlD9uA6iqAUArQwDBgX4T1Z+uF4Q4PB/sZmH/1e1BCRZiLhqgWKsJsYjJLUPkDEJKjvmPWwnwCtcKoW4O5VnpTFmaVb8o3LXONOiZAcI3aYe5UIFXiUmv77doOc7oUpDoozLU5iiPFqYtcW4W01LJP3FEiwzXBLG9SUBNq6Ef0BJ8IApq+rItIAAAAAElFTkSuQmCC";

const NodePickerHighlight = ({
  visible,
  width,
  height,
  left,
  top,
}: {
  visible: boolean;
  width: number;
  height: number;
  left: number;
  top: number;
}) => (
  <div
    css={{
      position: "absolute",
      pointerEvents: "none",
      top: 0,
      left: 0,
      background: "rgba(0, 0, 255, 0.3)",
      zIndex: 99999,
      cursor: "pointer",
      transform: `translateX(${left}px) translateY(${top}px)`,
      display: visible ? "block" : "none",
      width: `${width}px`,
      height: `${height}px`,
    }}
  />
);

function NodePicker() {
  const setTabIndex = useSetAtom(devToolTabIndexAtom);
  const [nodePicker, nodePickerApi] = useNodePicker();
  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      nodePickerApi.updatePosition(e.target as HTMLElement);
    },
    [nodePickerApi],
  );
  const handleNodeClick = React.useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      nodePickerApi.select(e.target as HTMLElement);
      setTabIndex("state");
    },
    [nodePickerApi],
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

  return (
    <NodePickerHighlight
      top={nodePicker.top}
      left={nodePicker.left}
      visible={Boolean(nodePicker.top && nodePicker.left)}
      width={nodePicker.width}
      height={nodePicker.height}
    />
  );
}

const NodePickerTrigger = ({
  children,
  isActive,
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
  children?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    css={{
      appearance: "none",
      position: "absolute",
      right: "4px",
      top: "-28px",
      width: "24px",
      height: "24px",
      border: "none",
      borderRadius: "3px",
      background: `${isActive ? theme.main : theme.main60} url("${icon}")`,
      backgroundSize: "20px 20px",
      backgroundRepeat: "none",
      backgroundPosition: "50% 50%",

      "&:hover": {
        backgroundColor: theme.main80,
        cursor: "pointer",
      },
    }}
  >
    {children}
  </button>
);

export { NodePicker, NodePickerTrigger };
