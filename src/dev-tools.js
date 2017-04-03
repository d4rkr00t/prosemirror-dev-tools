import React from "react";
import DevToolsCollapsed from "./dev-tools-collapsed";
import DevToolsExpanded from "./dev-tools-expanded";

export default class DevTools extends React.PureComponent {
  constructor() {
    super();
    this.state = { opened: false };
  }

  toggle() {
    this.setState({ opened: !this.state.opened });
  }

  render() {
    if (this.state.opened) {
      return (
        <DevToolsExpanded
          editorView={this.props.editorView}
          onClick={() => this.toggle()}
        />
      );
    } else {
      return <DevToolsCollapsed onClick={() => this.toggle()} />;
    }
  }
}
