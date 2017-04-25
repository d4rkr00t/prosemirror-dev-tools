import styled from "styled-components";
import colors from '../colors';

const Heading = styled.h2`
  padding: 0;
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 13px;
  color: ${colors.softerMain};
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
  color: ${colors.white80};
  text-transform: uppercase;
  transition: background .3s, color .3s;
  border-radius: 2px;
  border: none;
  background: transparent;

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

export { Heading, HeadingWithButton, HeadingButton };
