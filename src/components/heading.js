import styled from "styled-components";

const Heading = styled.h2`
  padding: 0;
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 13px;
  color: #BB91A3;
  text-transform: uppercase;
  flex-grow: 1;
`;

const HeadingWithButton = styled.div`
  display: flex;
`;

const HeadingButton = styled.button`
  padding: 6px 10px;
  margin: -6px -10px 0 8px;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 11px;
  color: rgba(255, 255, 255, .8);
  text-transform: uppercase;
  transition: background .3s, color .3s;
  border-radius: 2px;
  border: none;
  background: transparent;

  &:hover {
    background: rgba(191, 116, 135, 0.40);
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: rgba(191, 116, 135, 0.60);
  }
`;

export { Heading, HeadingWithButton, HeadingButton };
