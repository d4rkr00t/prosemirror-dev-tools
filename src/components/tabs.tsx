import React, { useContext } from "react";
import styled from "@emotion/styled";
import theme from "../theme";

const TabsContextProvider = React.createContext({
  selectedIndex: "state",
  // eslint-disable-next-line
  onSelect: (_index: string) => {},
});

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

export function Tab({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  const tabs = useContext(TabsContextProvider);
  return (
    <TabStyled
      isSelected={index === tabs.selectedIndex}
      onClick={() => tabs.onSelect(index)}
    >
      {children}
    </TabStyled>
  );
}

export const TabPanelStyled = styled("div")({
  width: "100%",
  height: "calc(100% - 48px)",
  boxSizing: "border-box",
});
TabPanelStyled.displayName = "TabPanelStyled";

export function TabPanel(props: {
  children: (prop: { index: string }) => React.ReactNode;
}) {
  const tabs = useContext(TabsContextProvider);
  return (
    <TabPanelStyled>
      {props.children({ index: tabs.selectedIndex })}
    </TabPanelStyled>
  );
}

export function Tabs(props: {
  onSelect: (index: string) => void;
  selectedIndex: string;
  children: React.ReactNode;
}) {
  return (
    <TabsContextProvider.Provider
      value={{
        onSelect: props.onSelect,
        selectedIndex: props.selectedIndex,
      }}
    >
      <TabsStled>{props.children}</TabsStled>
    </TabsContextProvider.Provider>
  );
}
