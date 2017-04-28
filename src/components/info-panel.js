import styled from "styled-components";

const InfoPanel = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: ${props => props.theme.main};
  font-size: 14px;
`;

export { InfoPanel };
