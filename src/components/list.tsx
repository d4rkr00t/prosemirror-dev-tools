import React from "react";
import styled from "@emotion/styled";
import theme from "../theme";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => undefined;

type ListItemProps = {
  isDimmed?: boolean;
  nested?: boolean;
  background?: (props: {
    isSelected?: boolean;
    isPrevious?: boolean;
  }) => string | undefined;
  isSelected?: boolean;
  isPrevious?: boolean;
};

export const ListItem = styled("div")<ListItemProps>(
  {
    minWidth: "190px",
    width: "100%",
    display: "flex",
    boxSizing: "border-box",
    fontWeight: 400,
    letterSpacing: "1px",
    fontSize: "11px",
    color: theme.white80,
    textTransform: "uppercase",
    transition: "background .3s",
    textAlign: "left",
    fontFamily: "monospace",
    border: "none",
    borderTop: `1px solid ${theme.main20}`,
    margin: 0,

    "&:first-of-type": {
      borderTop: "none",
    },

    "&:hover": {
      background: theme.main40,
      color: theme.white,
      cursor: "pointer",
    },

    "&:focus": {
      outline: "none",
    },

    "&:active": {
      background: theme.main60,
    },
  },
  (props: ListItemProps) => {
    return {
      opacity: props.isDimmed ? 0.3 : 1,
      padding: props.nested ? "6px 18px 6px 36px" : "6px 18px",
      background: props.background
        ? props.background(props)
        : props.isSelected
        ? theme.main40
        : "transparent",
    };
  }
);
ListItem.displayName = "ListItem";

type ListItemGroupContentProps = { collapsed: boolean };
const ListItemGroupContent = styled("div")<ListItemGroupContentProps>(
  {
    display: "block",
  },
  (props: ListItemGroupContentProps) => ({
    display: props.collapsed ? "none" : "block",
  })
);
ListItemGroupContent.displayName = "ListItemGroupContent";

type ListProps<Item> = {
  items: Array<Item>;
  isSelected?: IsSelectedHandler<Item>;
  isPrevious?: IsPreviousHandler<Item>;
  isDimmed?: isDimmedHandler<Item>;
  onListItemClick?: OnListItemClickHandler<Item>;
  onListItemDoubleClick?: OnListItemDoubleClickHandler<Item>;
  getKey: GetKey<Item>;
  title: GetTitle<Item>;
  groupTitle?: GetGroupTitle<Item>;
  customItemBackground?: (props: {
    isSelected?: boolean;
    isPrevious?: boolean;
  }) => string | undefined;
};

function ListItemGroup<Item>(
  props: ListProps<Item> & { children: React.ReactNode }
) {
  const [collapsed, setCollapsed] = React.useState(false);
  const {
    items,
    groupTitle = noop,
    title,
    isSelected = noop,
    isPrevious = noop,
    isDimmed = noop,
    getKey = noop,
    onListItemClick = noop,
    onListItemDoubleClick = noop,
    customItemBackground,
  } = props;
  return (
    <div>
      <ListItem
        key={getKey(items[0])}
        onClick={() => setCollapsed(!collapsed)}
        isSelected={items.some(isSelected) && collapsed}
        isPrevious={isPrevious(items[0], 0) && collapsed}
        isDimmed={items.every(isDimmed)}
        background={customItemBackground}
      >
        <div style={{ flexGrow: 1 }}>{groupTitle(items as any, 0)}</div>
        <div>{collapsed ? "▶" : "▼"}</div>
      </ListItem>
      <ListItemGroupContent collapsed={collapsed}>
        {(items || []).map((item, index) => {
          return (
            <ListItem
              key={getKey(item)}
              nested
              isSelected={isSelected(item, index)}
              isPrevious={isPrevious(item, index)}
              isDimmed={isDimmed(item, index)}
              background={customItemBackground}
              onClick={() => onListItemClick(item, index)}
              onDoubleClick={() => onListItemDoubleClick(item, index)}
            >
              {title(item, index)}
            </ListItem>
          );
        })}
      </ListItemGroupContent>
    </div>
  );
}

export function List<Item>(props: ListProps<Item>) {
  const {
    isSelected = noop,
    isPrevious = noop,
    isDimmed = noop,
    getKey = noop,
    onListItemClick = noop,
    onListItemDoubleClick = noop,
  } = props;
  return (
    <div>
      {(props.items || []).map((item, index) => {
        if (Array.isArray(item)) {
          return (
            <ListItemGroup {...props} items={item} key={item[0].timestamp}>
              {(props.groupTitle || noop)(item, index)}
            </ListItemGroup>
          );
        }

        return (
          <ListItem
            key={getKey(item)}
            isSelected={isSelected(item, index)}
            isPrevious={isPrevious(item, index)}
            isDimmed={isDimmed(item, index)}
            background={props.customItemBackground}
            onClick={() => onListItemClick(item, index)}
            onDoubleClick={() => onListItemDoubleClick(item, index)}
          >
            {props.title(item, index)}
          </ListItem>
        );
      })}
    </div>
  );
}

type IsSelectedHandler<T> = (item: T, index: number) => boolean | undefined;
type IsPreviousHandler<T> = (item: T, index: number) => boolean | undefined;
type isDimmedHandler<T> = (item: T, index: number) => boolean | undefined;
type OnListItemClickHandler<T> = (item: T, index: number) => void;
type OnListItemDoubleClickHandler<T> = (item: T, index: number) => void;
type GetKey<T> = (item: T) => string;
type GetTitle<T> = (
  item: T,
  index: number
) => string | undefined | React.ReactNode;
type GetGroupTitle<T> = (item: T, index: number) => string | undefined;
