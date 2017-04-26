import styled from "styled-components";

const Button = styled.button`
  background: ${({ isActive, theme }) => isActive ? theme.main80 : theme.main40};
  border: none;
  color: #fff;
  padding: ${({ isSmall }) => isSmall ? "8px 16px;" : "12px 24px;"}
  text-transform: uppercase;
  transition: background .3s;
  border-radius: 3px;

  &:hover {
    background: ${({ isActive, theme }) => isActive ? theme.main90 : theme.main60};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: ${({ isActive, theme }) => isActive ? theme.main : theme.main80};
  }
`;

export default Button;
