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

type TabStyledProps = { isSelected: boolean };
export const TabStyled = styled("div")<TabStyledProps>(
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
  (props: TabStyledProps) => ({
    borderBottom: props.isSelected ? `2px solid ${theme.main}` : "none",
  })
);
TabStyled.displayName = "TabStyled";

export class Tab extends React.Component<{ index: string }> {
  render() {
    return (
      <TabStyled
        isSelected={this.props.index === this.context.tabs.selectedIndex}
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          (this.context.tabs.onSelect || (() => {}))(this.props.index);
        }}
      >
        {this.props.children}
      </TabStyled>
    );
  }
}
// @ts-expect-error skipping for now until switch to new context
Tab.contextTypes = {
  tabs: PropTypes.object.isRequired,
};

export const TabPanelStyled = styled("div")({
  width: "100%",
  height: "calc(100% - 48px)",
  boxSizing: "border-box",
});
TabPanelStyled.displayName = "TabPanelStyled";

export class TabPanel extends React.Component<{
  children: (prop: { index: number }) => React.ReactNode;
}> {
  render() {
    return (
      <TabPanelStyled>
        {this.props.children({ index: this.context.tabs.selectedIndex })}
      </TabPanelStyled>
    );
  }
}

// @ts-expect-error skipping for now until switch to new context
TabPanel.contextTypes = {
  tabs: PropTypes.object.isRequired,
};

export class Tabs extends React.Component<{
  onSelect: (index: string) => void;
  selectedIndex: string;
}> {
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

// @ts-expect-error skipping for now until switch to new context
Tabs.childContextTypes = {
  tabs: PropTypes.object,
};
