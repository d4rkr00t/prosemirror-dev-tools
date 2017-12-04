import styled from "styled-components";
import { connect } from "@cerebral/react";
import { state } from "cerebral/tags";

const icon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAQAAAACNCElAAAAxklEQVRIx+2Vuw3DMAxEXWUD9VrKvTYJRzAygWpPkSVcBlDtJS6Fg8AQqQ+lAEECXU08iid+pmnoTwWDKzbU6IEbLnkYQaMlD9uA6iqAUArQwDBgX4T1Z+uF4Q4PB/sZmH/1e1BCRZiLhqgWKsJsYjJLUPkDEJKjvmPWwnwCtcKoW4O5VnpTFmaVb8o3LXONOiZAcI3aYe5UIFXiUmv77doOc7oUpDoozLU5iiPFqYtcW4W01LJP3FEiwzXBLG9SUBNq6Ef0BJ8IApq+rItIAAAAAElFTkSuQmCC";

const NodePicker = connect(
  {
    nodePicker: state`editor.nodePicker`
  },
  styled.div`
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
  `
);

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
