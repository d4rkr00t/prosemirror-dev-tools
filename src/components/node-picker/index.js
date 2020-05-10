import React from "react";
import styled from "@emotion/styled";
import theme from "../../theme";

const icon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAQAAAACNCElAAAAxklEQVRIx+2Vuw3DMAxEXWUD9VrKvTYJRzAygWpPkSVcBlDtJS6Fg8AQqQ+lAEECXU08iid+pmnoTwWDKzbU6IEbLnkYQaMlD9uA6iqAUArQwDBgX4T1Z+uF4Q4PB/sZmH/1e1BCRZiLhqgWKsJsYjJLUPkDEJKjvmPWwnwCtcKoW4O5VnpTFmaVb8o3LXONOiZAcI3aYe5UIFXiUmv77doOc7oUpDoozLU5iiPFqYtcW4W01LJP3FEiwzXBLG9SUBNq6Ef0BJ8IApq+rItIAAAAAElFTkSuQmCC";

const NodePickerStyled = styled("div")(
  {
    position: "absolute",
    pointerEvents: "none",
    top: 0,
    left: 0,
    background: "rgba(0, 0, 255, 0.3)",
    zIndex: 99999,
    cursor: "pointer",
  },
  ({ nodePicker }) => ({
    transform: `translateX(${nodePicker.left}px) translateY(${nodePicker.top}px)`,
    display: nodePicker.top && nodePicker.left ? "block" : "none",
    width: `${nodePicker.width}px`,
    height: `${nodePicker.height}px`,
  })
);
NodePickerStyled.displayName = "NodePickerStyled";

class NodePicker extends React.Component {
  componentDidMount() {
    if (this.props.nodePicker.active) {
      this.initEventHandlers();
    }
  }

  componentWillReceiveProps(nextProps) {
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

  handleMouseMove = (e) => {
    if (!this.props.nodePicker.active) return;
    this.props.onMouseMove(e.target);
  };

  handleNodeClick = (e) => {
    if (!this.props.nodePicker.active) return;
    e.preventDefault();
    this.props.onSelect(e.target);
  };

  closePicker = () => {
    if (!this.props.nodePicker.active) return;
    this.props.onClose();
  };

  render() {
    return <NodePickerStyled nodePicker={this.props.nodePicker} />;
  }
}

const NodePickerTrigger = styled("div")(
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
  ({ isActive }) => ({
    background: `${isActive ? theme.main : theme.main60} url("${icon}")`,
    backgroundSize: "20px 20px",
    backgroundRepeat: "none",
    backgroundPosition: "50% 50%",
  })
);
NodePickerTrigger.displayName = "NodePickerTrigger";

export { NodePicker, NodePickerTrigger };
