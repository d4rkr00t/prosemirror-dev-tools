import React, { MouseEventHandler, useContext } from "react";
import "@compiled/react";
import theme from "../theme";

const TabsContextProvider = React.createContext({
  selectedIndex: "state",
  // eslint-disable-next-line
  onSelect: (_index: string) => {},
});

export const TabList = ({ children }: { children: React.ReactNode }) => (
  <div
    data-test-id="__prosemirror_devtools_tabs_buttons_container__"
    css={{
      display: "flex",
      listStyle: "none",
      borderBottom: `1px solid ${theme.main20}`,
    }}
  >
    {children}
  </div>
);

const TabsStyled = ({ children }: { children: React.ReactNode }) => (
  <div
    data-test-id="__prosemirror_devtools_tabs_container__"
    css={{
      height: "100%",
      width: "100%",
    }}
  >
    {children}
  </div>
);

type TabStyledProps = {
  isSelected: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
};
const TabStyled = ({ children, isSelected, onClick }: TabStyledProps) => (
  <div
    css={{
      color: theme.text,
      textTransform: "uppercase",
      fontSize: "13px",
      padding: "16px 24px 14px",
      boxSizing: "border-box",
      userSelect: "none",
      borderBottom: isSelected ? `2px solid ${theme.main}` : "none",

      "&:hover": {
        cursor: "pointer",
        background: theme.white05,
      },

      "&:focus": {
        outline: "none",
      },
    }}
    onClick={onClick}
  >
    {children}
  </div>
);

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

export function TabPanel(props: {
  children: (prop: { index: string }) => React.ReactNode;
}) {
  const tabs = useContext(TabsContextProvider);
  return (
    <div
      css={{
        width: "100%",
        height: "calc(100% - 48px)",
        boxSizing: "border-box",
      }}
    >
      {props.children({ index: tabs.selectedIndex })}
    </div>
  );
}

export function Tabs(props: {
  onSelect: (index: string) => void;
  selectedIndex: string;
  children: React.ReactNode;
}) {
  const Component = TabsContextProvider.Provider as (props: {
    value: any;
    children: React.ReactNode;
  }) => React.ReactElement;

  return (
    <Component
      value={{
        onSelect: props.onSelect,
        selectedIndex: props.selectedIndex,
      }}
    >
      <TabsStyled>{props.children}</TabsStyled>
    </Component>
  );
}
