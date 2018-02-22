import React from "react";
import styled from "styled-components";

const icon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAQAAAACNCElAAAAxklEQVRIx+2Vuw3DMAxEXWUD9VrKvTYJRzAygWpPkSVcBlDtJS6Fg8AQqQ+lAEECXU08iid+pmnoTwWDKzbU6IEbLnkYQaMlD9uA6iqAUArQwDBgX4T1Z+uF4Q4PB/sZmH/1e1BCRZiLhqgWKsJsYjJLUPkDEJKjvmPWwnwCtcKoW4O5VnpTFmaVb8o3LXONOiZAcI3aYe5UIFXiUmv77doOc7oUpDoozLU5iiPFqYtcW4W01LJP3FEiwzXBLG9SUBNq6Ef0BJ8IApq+rItIAAAAAElFTkSuQmCC";

const NodePickerStyled = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  background: rgba(0, 0, 255, 0.3);
  transform: ${({ nodePicker }) =>
    `translateX(${nodePicker.left}px) translateY(${nodePicker.top}px);`};
  display: ${({ nodePicker }) =>
    nodePicker.top && nodePicker.left ? "block" : "none"};
  width: ${({ nodePicker }) => `${nodePicker.width}px;`};
  height: ${({ nodePicker }) => `${nodePicker.height}px;`};
  z-index: 99999;
  cursor: pointer;
`;

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

  handleMouseMove = e => {
    if (!this.props.nodePicker.active) return;
    this.props.onMouseMove(e.target);
  };

  handleNodeClick = e => {
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

const NodePickerTrigger = styled.div`
  position: absolute;
  right: 4px;
  top: -28px;
  background: ${props =>
    props.isActive ? props.theme.main : props.theme.main60} url("${icon}");
  width: 24px;
  height: 24px;
  background-size: 20px 20px;
  background-repeat: none;
  background-position: 50% 50%;
  border-radius: 3px;

  &:hover {
    background-color: ${props => props.theme.main80};
    cursor: pointer;
  }
`;

export { NodePicker, NodePickerTrigger };
