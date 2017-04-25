import styled from "styled-components";
import colors from "../colors";

export const ListItem = styled.button`
  width: 180px;
  display: block;
  padding: 6px 18px;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 11px;
  color: ${colors.white80};
  text-transform: uppercase;
  transition: background .3s, color .3s;
  border-radius: 2px;
  border: none;
  background: ${props => props.background ? props.background(props) : props.isSelected ? colors.main40 : "transparent"};
  text-align: left;
  font-family: monospace;
  transition: background .3s;
  border-top: 1px solid ${colors.main20};
  opacity: ${props => props.isDimmed ? 0.3 : 1};

  &:first-child {
    border-top: none;
  }

  &:hover {
    background: ${colors.main40};
    color: ${colors.white};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: ${colors.main60};
  }
`;
