import React from "react";
import styled from "@emotion/styled";
import theme from "../../theme";
import type { NodePickerState } from "../../state/node-picker";

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

type NodePickerProps = {
  nodePicker: NodePickerState;
  onMouseMove: (target: HTMLElement) => void;
  onSelect: (target: HTMLElement) => void;
  onClose: () => void;
};
class NodePicker extends React.Component<NodePickerProps> {
  componentDidMount() {
    if (this.props.nodePicker.active) {
      this.initEventHandlers();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: NodePickerProps) {
    this.destroyEventHandlers();

    if (nextProps.nodePicker.active) {
      this.initEventHandlers();
    }
  }

  componentWillUnmount() {
    this.destroyEventHandlers();
  }

  initEventHandlers() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("click", this.handleNodeClick);
    document.addEventListener("keydown", this.closePicker);
  }

  destroyEventHandlers() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("click", this.handleNodeClick);
    document.removeEventListener("keydown", this.closePicker);
  }

  handleMouseMove = (e: MouseEvent) => {
    if (!this.props.nodePicker.active) return;
    this.props.onMouseMove(e.target as HTMLElement);
  };

  handleNodeClick = (e: MouseEvent) => {
    if (!this.props.nodePicker.active) return;
    e.preventDefault();
    this.props.onSelect(e.target as HTMLElement);
  };

  closePicker = () => {
    if (!this.props.nodePicker.active) return;
    this.props.onClose();
  };

  render() {
    return <NodePickerStyled nodePicker={this.props.nodePicker} />;
  }
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
