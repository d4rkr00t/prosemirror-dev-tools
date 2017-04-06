import React from "react";
import format from "date-fns/format";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";
import styled from "styled-components";
import { SplitView, SplitViewCol } from "./../split-view";
import JSONDiff from "./../json-diff";

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
  border-top: 1px solid rgba(255, 162, 177, .2);

  &:first-child {
    border-top: none;
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

export default connect(
  {
    history: state`editor.history`,
    selectedItemIndex: state`editor.selectedHistoryItem`,
    historyRolledBackTo: state`editor.historyRolledBackTo`,
    historyItemSelected: signal`editor.historyItemSelected`,
    historyRolledBack: signal`editor.historyRolledBack`
  },
  function HistoryView({
    history,
    selectedItemIndex,
    historyRolledBackTo,
    historyItemSelected,
    historyRolledBack
  }) {
    const prevItem = history[selectedItemIndex + 1];
    const selectedItem = history[selectedItemIndex];
    const historyRolledBackToItem = history[historyRolledBackTo];

    return (
      <SplitView>
        <SplitViewCol noPaddings>
          {history.map((item, index) => (
            <HistoryItem
              isSelected={item.timestamp === selectedItem.timestamp}
              isPrevious={item.timestamp === (prevItem && prevItem.timestamp)}
              isFuture={
                historyRolledBackToItem &&
                  item.timestamp > historyRolledBackToItem.timestamp
              }
              key={item.timestamp}
              onClick={() => historyItemSelected({ index })}
              onDoubleClick={() => historyRolledBack({ index })}
            >
              {format(new Date(item.timestamp), "HH:mm:ss:SSS")}
            </HistoryItem>
          ))}
        </SplitViewCol>
        <SplitViewCol grow sep>
          <JSONDiff
            current={selectedItem.state.doc.toJSON()}
            prev={prevItem && prevItem.state.doc.toJSON()}
          />
        </SplitViewCol>
      </SplitView>
    );
  }
);
