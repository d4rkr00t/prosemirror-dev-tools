import styled from "styled-components";

const Button = styled.button`
  background: rgba(191, 116, 135, 0.40);
  border: none;
  color: #fff;
  padding: 12px 24px;
  text-transform: uppercase;
  transition: background .3s;
  border-radius: 3px;

  &:hover {
    background: rgba(191, 116, 135, 0.60);
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: rgba(191, 116, 135, 0.80);
  }
`;

export default Button;
