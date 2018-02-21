import { Container } from "unstated";

export default class StateTabStateContainer extends Container {
  state = {
    selectionExpanded: false
  };

  toggleSelection = () => {
    this.setState({ selectionExpanded: !this.state.selectionExpanded });
  };
}
