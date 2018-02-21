import { Container } from "unstated";

export default class PluginsTabStateContainer extends Container {
  state = {
    selected: 0
  };

  selectPlugin = index => {
    this.setState({ selected: index });
  };
}
