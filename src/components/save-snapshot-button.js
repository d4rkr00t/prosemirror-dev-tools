import styled from "styled-components";

const SaveSnapshotButton = styled.div`
  position: absolute;
  right: 32px;
  top: -28px;
  color: ${props => props.theme.white};
  background: ${props => props.theme.main60};
  font-size: 12px;
  line-height: 25px;
  padding: 0 6px;
  height: 24px;
  background-size: 20px 20px;
  background-repeat: none;
  background-position: 50% 50%;
  border-radius: 3px;

  &:hover {
    background-color: ${props => props.theme.main80};
    cursor: pointer;
  }
`;

export default SaveSnapshotButton;
