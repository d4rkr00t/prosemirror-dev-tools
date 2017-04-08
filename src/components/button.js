import styled from "styled-components";

const Button = styled.button`
  background: ${({ isActive }) => isActive ? "rgba(191, 116, 135, 0.80)" : "rgba(191, 116, 135, 0.40)"};
  border: none;
  color: #fff;
  padding: ${({ isSmall }) => isSmall ? "8px 16px;" : "12px 24px;"}
  text-transform: uppercase;
  transition: background .3s;
  border-radius: 3px;

  &:hover {
    background: ${({ isActive }) => isActive ? "rgba(191, 116, 135, 0.90)" : "rgba(191, 116, 135, 0.60)"};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: ${({ isActive }) => isActive ? "rgba(191, 116, 135, 1)" : "rgba(191, 116, 135, 0.80)"};
  }
`;

export default Button;
