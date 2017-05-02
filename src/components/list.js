import React, { PureComponent } from "react";
import styled from "styled-components";

const noop = () => {};

export const ListItem = styled.div`
  min-width: 190px;
  width: 100%;
  display: flex;
  padding: ${props => props.nested ? "6px 18px 6px 36px" : "6px 18px"};
  box-sizing: border-box;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 11px;
  color: ${props => props.theme.white80};
  text-transform: uppercase;
  transition: background .3s, color .3s;
  border: none;
  background: ${props => props.background ? props.background(props) : props.isSelected ? props.theme.main40 : "transparent"};
  text-align: left;
  font-family: monospace;
  transition: background .3s;
  border-top: 1px solid ${props => props.theme.main20};
  opacity: ${props => props.isDimmed ? 0.3 : 1};
  margin: 0;

  &:first-child {
    border-top: none;
  }

  &:hover {
    background: ${props => props.theme.main40};
    color: ${props => props.theme.white};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: ${props => props.theme.main60};
  }
`;

const ListItemGroupContent = styled.div`
  display: ${props => props.collapsed ? "none" : "block"}
`;

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
          isSelected={items.some(isSelected) && this.state.collapsed}
          isDimmed={items.every(isDimmed)}
          isPrevious={isPrevious(items[0], 0) && this.state.collapsed}
          background={customItemBackground}
        >
          <div style={{ flexGrow: 1 }}>{groupTitle(items, 0)}</div>
          <div>{this.state.collapsed ? "▶" : "▼"}</div>
        </ListItem>
        <ListItemGroupContent collapsed={this.state.collapsed}>
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
