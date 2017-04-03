import React from "react";
import format from "date-fns/format";
import styled from "styled-components";
import { SplitView, SplitViewCol } from "./split-view";
import JSONDiff from "./json-diff";

const HistoryItem = styled.button`
  width: 180px;
  display: block;
  padding: 6px 18px;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 11px;
  color: rgba(255, 255, 255, .8);
  text-transform: uppercase;
  transition: background .3s, color .3s;
  border-radius: 2px;
  border: none;
  background: ${props => props.isSelected ? "rgba(191, 116, 135, 0.40)" : props.isPrevious ? "rgba(191, 116, 135, 0.20)" : "transparent"};
  text-align: left;
  font-family: monospace;
  transition: background .3s;
  opacity: ${props => props.isFuture ? 0.3 : 1};

  & + & {
    border-top: 1px solid rgba(255, 162, 177, .2);
  }

  &:hover {
    background: rgba(191, 116, 135, 0.40);
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background: rgba(191, 116, 135, 0.60);
  }
`;

export default function HistoryView(props) {
  return (
    <SplitView>
      <SplitViewCol noPaddings>
        {props.history.map((item, index) => (
          <HistoryItem
            isSelected={item.timestamp === props.selectedItem.timestamp}
            isPrevious={
              item.timestamp === (props.prevItem && props.prevItem.timestamp)
            }
            isFuture={
              item.timestamp > props.selectedItem.timestamp &&
                props.movedToStateInHistory
            }
            key={item.timestamp}
            onClick={() => props.onClick(index)}
            onDoubleClick={() => props.onDoubleClick(index)}
          >
            {format(new Date(item.timestamp), "HH:mm:ss:SSS")}
          </HistoryItem>
        ))}
      </SplitViewCol>
      <SplitViewCol grow sep>
        <JSONDiff
          current={props.selectedItem.doc}
          prev={props.prevItem && props.prevItem.doc}
        />
      </SplitViewCol>
    </SplitView>
  );
}
