import styled from "styled-components";
import colors from "../colors";

export const SplitView = styled.div`
  display: flex;
  height: 100%;
`;

export const SplitViewCol = styled.div`
  flex-grow: ${props => props.grow ? 1 : 0};
  box-sizing: border-box;
  border-left: ${props => props.sep ? "1px solid " + colors.main20 : "none"};
  padding: ${props => props.noPaddings ? "" : "16px 18px 18px"};
  overflow: scroll;
  height: 100%;
  ${({ minWidth }) => minWidth ? `min-width: ${minWidth}px;` : ""}
  ${({ maxWidth }) => maxWidth ? `max-width: ${maxWidth}px;` : ""}
`;
