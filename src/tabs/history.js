import React from "react";
import format from "date-fns/format";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";

import { ListItem } from "../components/list";
import JSONDiff from "../components/json-diff";
import { SplitView, SplitViewCol } from "../components/split-view";
import colors from "../colors";

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
            <ListItem
              isSelected={item.timestamp === selectedItem.timestamp}
              isPrevious={item.timestamp === (prevItem && prevItem.timestamp)}
              isDimmed={
                historyRolledBackToItem &&
                  item.timestamp > historyRolledBackToItem.timestamp
              }
              key={item.timestamp}
              background={props =>
                props.isSelected
                  ? colors.main40
                  : props.isPrevious ? colors.main20 : "transparent"}
              onClick={() => historyItemSelected({ index })}
              onDoubleClick={() => historyRolledBack({ index })}
            >
              {format(new Date(item.timestamp), "HH:mm:ss:SSS")}
            </ListItem>
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
