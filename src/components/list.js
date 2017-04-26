import styled from "styled-components";

export const ListItem = styled.button`
  width: 180px;
  display: block;
  padding: 6px 18px;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 11px;
  color: ${props => props.theme.white80};
  text-transform: uppercase;
  transition: background .3s, color .3s;
  border-radius: 2px;
  border: none;
  background: ${props => props.background ? props.background(props) : props.isSelected ? props.theme.main40 : "transparent"};
  text-align: left;
  font-family: monospace;
  transition: background .3s;
  border-top: 1px solid ${props => props.theme.main20};
  opacity: ${props => props.isDimmed ? 0.3 : 1};

  &:first-child {
    border-top: none;
  }

  &:hover {
    background: ${props => props.theme.main40};
    color: ${props => props.theme.white};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: ${props => props.theme.main60};
  }
`;
