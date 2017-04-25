import styled from "styled-components";
import colors from "../colors";

const Button = styled.button`
  background: ${({ isActive }) => isActive ? colors.main80 : colors.main40};
  border: none;
  color: #fff;
  padding: ${({ isSmall }) => isSmall ? "8px 16px;" : "12px 24px;"}
  text-transform: uppercase;
  transition: background .3s;
  border-radius: 3px;

  &:hover {
    background: ${({ isActive }) => isActive ? colors.main90 : colors.main60};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: ${({ isActive }) => isActive ? colors.main : colors.main80};
  }
`;

export default Button;
