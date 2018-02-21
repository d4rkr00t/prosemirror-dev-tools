import { Container } from "unstated";

export default class StructureTabStateContainer extends Container {
  state = {
    selectedNode: null
  };

  selectNode = ({ node }) => {
    this.setState({ selectedNode: node });
  };
}
