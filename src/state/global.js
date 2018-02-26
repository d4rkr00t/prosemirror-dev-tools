import { Container } from "unstated";

export default class GlobalStateContainer extends Container {
  state = {
    opened: false,
    tabIndex: "state",
    defaultSize: 0.5
  };

  toggleDevTools = () => {
    const { opened, defaultSize } = this.state;

    if (opened) {
      document.querySelector("html").style.marginBottom = "";
    } else {
      const size = defaultSize * window.innerHeight;
      document.querySelector("html").style.marginBottom = `${size}px`;
    }

    this.setState({ opened: !opened });
  };

  selectTab = (tabIndex = 0) => {
    this.setState({ tabIndex });
  };

  updateBodyMargin = devToolsSize => {
    const size = devToolsSize * window.innerHeight;
    document.querySelector("html").style.marginBottom = `${size}px`;
  };
}
