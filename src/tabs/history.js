import React from "react";
import format from "date-fns/format";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";

import { List } from "../components/list";
import JSONDiff from "../components/json-diff";
import { SplitView, SplitViewCol } from "../components/split-view";

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
    const historyList = history
      .reduce(
        (h, item, index) => {
          const prev = h[h.length - 1];

          item.index = index;

          if (!item.diff) {
            if (!prev || !Array.isArray(prev)) {
              h.push([item]);
            } else {
              prev.push(item);
            }
          } else {
            h.push(item);
          }

          return h;
        },
        []
      )
      .reduce(
        (h, item) => {
          if (Array.isArray(item) && item.length === 1) {
            h.push(item[0]);
          } else {
            h.push(item);
          }
          return h;
        },
        []
      );

    const isSelected = item => item.timestamp === selectedItem.timestamp;
    const isPrevious = item =>
      prevItem && item.timestamp === prevItem.timestamp;
    const isDimmed = item =>
      historyRolledBackToItem &&
      item.timestamp > historyRolledBackToItem.timestamp;

    return (
      <SplitView>
        <SplitViewCol noPaddings>
          <List
            items={historyList}
            getKey={item => item.timestamp}
            title={item => format(new Date(item.timestamp), "HH:mm:ss:SSS")}
            groupTitle={item =>
              format(new Date(item[0].timestamp), "HH:mm:ss:SSS") +
              ` [${item.length}]`}
            isSelected={isSelected}
            isPrevious={isPrevious}
            isDimmed={isDimmed}
            customItemBackground={props =>
              props.isSelected
                ? props.theme.main40
                : props.isPrevious ? props.theme.main20 : "transparent"}
            onListItemClick={item => historyItemSelected({ index: item.index })}
            onListItemDoubleClick={item =>
              historyRolledBack({ index: item.index })}
          />
        </SplitViewCol>
        <SplitViewCol grow sep>
          <JSONDiff delta={selectedItem.diff} />
        </SplitViewCol>
      </SplitView>
    );
  }
);
