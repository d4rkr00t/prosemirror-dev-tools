import React, { PureComponent } from "react";
import glamorous from "glamorous/dist/glamorous.esm.tiny";
import theme from "../theme";

const noop = () => {};

export const ListItem = glamorous("div")(
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

    "&:first-child": {
      borderTop: "none"
    },

    "&:hover": {
      background: theme.main40,
      color: theme.white,
      cursor: "pointer"
    },

    "&:focus": {
      outline: "none"
    },

    "&:active": {
      background: theme.main60
    }
  },
  props => {
    const { glam } = props;
    return {
      opacity: glam.isDimmed ? 0.3 : 1,
      padding: glam.nested ? "6px 18px 6px 36px" : "6px 18px",
      background: glam.background
        ? glam.background(props)
        : glam.isSelected ? theme.main40 : "transparent"
    };
  }
);
ListItem.displayName = "ListItem";

const ListItemGroupContent = glamorous("div")(
  {
    display: "block"
  },
  ({ glam }) => ({
    display: glam.collapsed ? "none" : "block"
  })
);
ListItemGroupContent.displayName = "ListItemGroupContent";

class ListItemGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { collapsed: true };
  }

  toggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const {
      items,
      groupTitle,
      title,
      isSelected = noop,
      isPrevious = noop,
      isDimmed = noop,
      getKey = noop,
      onListItemClick = noop,
      onListItemDoubleClick = noop,
      customItemBackground
    } = this.props;
    return (
      <div>
        <ListItem
          key={getKey(items[0])}
          onClick={() => this.toggle()}
          glam={{
            nested: true,
            isSelected: items.some(isSelected) && this.state.collapsed,
            isPrevious: isPrevious(items[0], 0) && this.state.collapsed,
            isDimmed: items.every(isDimmed),
            background: customItemBackground
          }}
        >
          <div style={{ flexGrow: 1 }}>{groupTitle(items, 0)}</div>
          <div>{this.state.collapsed ? "▶" : "▼"}</div>
        </ListItem>
        <ListItemGroupContent glam={{ collapsed: this.state.collapsed }}>
          {(items || []).map((item, index) => {
            return (
              <ListItem
                key={getKey(item)}
                glam={{
                  nested: true,
                  isSelected: isSelected(item, index),
                  isPrevious: isPrevious(item, index),
                  isDimmed: isDimmed(item, index),
                  background: customItemBackground
                }}
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
}

export function List(props) {
  const {
    isSelected = noop,
    isPrevious = noop,
    isDimmed = noop,
    getKey = noop,
    onListItemClick = noop,
    onListItemDoubleClick = noop
  } = props;
  return (
    <div>
      {(props.items || []).map((item, index) => {
        if (Array.isArray(item)) {
          return (
            <ListItemGroup {...props} items={item} key={item[0].timestamp}>
              {props.groupTitle(item, index)}
            </ListItemGroup>
          );
        }

        return (
          <ListItem
            key={getKey(item)}
            glam={{
              nested: true,
              isSelected: isSelected(item, index),
              isPrevious: isPrevious(item, index),
              isDimmed: isDimmed(item, index),
              background: props.customItemBackground
            }}
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
