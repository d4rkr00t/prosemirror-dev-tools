import styled from "styled-components";
import colors from "../colors";

const InfoPanel = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: ${colors.main};
  font-size: 14px;
`;

export default InfoPanel;
