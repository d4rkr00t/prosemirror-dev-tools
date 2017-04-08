import styled from "styled-components";
import { connect } from "cerebral/react";
import { state } from "cerebral/tags";

const NodePicker = styled.div`
  position: absolute;
  pointer-events: none;
  background: rgba(0, 0, 255, .3);
  top: 0;
  left: 0;
  transform: ${({ nodePicker }) => `translateX(${nodePicker.left}px) translateY(${nodePicker.top}px);`};
  display: ${({ nodePicker }) => nodePicker.top && nodePicker.left ? "block" : "none"};
  width: ${({ nodePicker }) => `${nodePicker.width}px;`};
  height: ${({ nodePicker }) => `${nodePicker.height}px;`};
  z-index: 99999;
  cursor: pointer;
`;

export default connect(
  {
    nodePicker: state`editor.nodePicker`
  },
  NodePicker
);
