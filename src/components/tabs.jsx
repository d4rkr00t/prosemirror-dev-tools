import React from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import theme from "../theme";

export const TabList = styled("div")({
  display: "flex",
  listStyle: "none",
  borderBottom: `1px solid ${theme.main20}`,
});
TabList.displayName = "TabList";

export const TabsStled = styled("div")({
  height: "100%",
  width: "100%",
});
TabsStled.displayName = "TabsStyled";

export const TabStyled = styled("div")(
  {
    color: theme.white,
    textTransform: "uppercase",
    fontSize: "13px",
    padding: "16px 24px 14px",
    boxSizing: "border-box",
    userSelect: "none",

    "&:hover": {
      cursor: "pointer",
      background: theme.white05,
    },

    "&:focus": {
      outline: "none",
    },
  },
  (props) => ({
    borderBottom: props.isSelected ? `2px solid ${theme.main}` : "none",
  })
);
TabStyled.displayName = "TabStyled";

export class Tab extends React.Component {
  render() {
    return (
      <TabStyled
        isSelected={this.props.index === this.context.tabs.selectedIndex}
        onClick={() => {
          (this.context.tabs.onSelect || (() => {}))(this.props.index);
        }}
      >
        {this.props.children}
      </TabStyled>
    );
  }
}
Tab.contextTypes = {
  tabs: PropTypes.object.isRequired,
};

export const TabPanelStyled = styled("div")({
  width: "100%",
  height: "calc(100% - 48px)",
  boxSizing: "border-box",
});
TabPanelStyled.displayName = "TabPanelStyled";

export class TabPanel extends React.Component {
  render() {
    return (
      <TabPanelStyled>
        {this.props.children({ index: this.context.tabs.selectedIndex })}
      </TabPanelStyled>
    );
  }
}
TabPanel.contextTypes = {
  tabs: PropTypes.object.isRequired,
};

export class Tabs extends React.Component {
  getChildContext() {
    return {
      tabs: {
        onSelect: this.props.onSelect,
        selectedIndex: this.props.selectedIndex,
      },
    };
  }

  render() {
    return <TabsStled>{this.props.children}</TabsStled>;
  }
}

Tabs.childContextTypes = {
  tabs: PropTypes.object,
};
