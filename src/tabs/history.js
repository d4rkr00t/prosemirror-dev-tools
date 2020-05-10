import React from "react";
import styled from "@emotion/styled";
import { Subscribe } from "unstated";
import EditorStateContainer from "../state/editor";
import { InfoPanel } from "../components/info-panel";
import { Heading } from "./../components/heading";
import { List } from "../components/list";
import JSONDiff from "../components/json-diff";
import { SplitView, SplitViewCol } from "../components/split-view";
import { Highlighter } from "../components/highlighter";
import theme from "../theme";

const Section = styled("div")({
  minWidth: "180px",
  boxSizing: "border-box",

  "& + &": {
    paddingTop: "9px",
  },
});
Section.displayName = "Section";

function pad(num) {
  return ("00" + num).slice(-2);
}

function pad3(num) {
  return ("000" + num).slice(-3);
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
    pad3(date.getMilliseconds()),
  ].join(":");
};

export function SelectionContentSection(props) {
  if (!props.selectionContent) return null;

  return (
    <Section>
      <Heading>Selection Content</Heading>
      <Highlighter>{props.selectionContent}</Highlighter>
    </Section>
  );
}

export function DocDiffSection(props) {
  if (!props.diff) return null;

  return (
    <Section>
      <Heading>Doc diff</Heading>
      <JSONDiff delta={props.diff} />
    </Section>
  );
}

export function SelectionSection(props) {
  if (!props.selection) return null;

  return (
    <Section>
      <Heading>Selection diff</Heading>
      <JSONDiff delta={props.selection} />
    </Section>
  );
}

export default function HistoryView() {
  return (
    <Subscribe to={[EditorStateContainer]}>
      {(editorState) => {
        const { selectHistoryItem, rollbackHistory } = editorState;
        const {
          history,
          selectedHistoryItem,
          historyRolledBackTo,
        } = editorState.state;
        const prevItem = history[selectedHistoryItem + 1];
        const selectedItem = history[selectedHistoryItem];
        const historyRolledBackToItem = history[historyRolledBackTo];
        const historyList = history
          .reduce((h, item, index) => {
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
          }, [])
          .reduce((h, item) => {
            if (Array.isArray(item) && item.length === 1) {
              h.push(item[0]);
            } else {
              h.push(item);
            }
            return h;
          }, []);

        const isSelected = (item) => item.timestamp === selectedItem.timestamp;
        const isPrevious = (item) =>
          prevItem && item.timestamp === prevItem.timestamp;
        const isDimmed = (item) =>
          historyRolledBackToItem &&
          item.timestamp > historyRolledBackToItem.timestamp;

        return (
          <SplitView>
            <SplitViewCol noPaddings minWidth={190}>
              <List
                items={historyList}
                getKey={(item) => item.timestamp}
                title={(item) => formatTimestamp(item.timestamp)}
                groupTitle={(item) => {
                  return (
                    formatTimestamp(item[0].timestamp) + ` [${item.length}]`
                  );
                }}
                isSelected={isSelected}
                isPrevious={isPrevious}
                isDimmed={isDimmed}
                customItemBackground={(props) =>
                  props.isSelected
                    ? theme.main40
                    : props.isPrevious
                    ? theme.main20
                    : "transparent"
                }
                onListItemClick={(item) => selectHistoryItem(item.index)}
                onListItemDoubleClick={(item) => rollbackHistory(item.index)}
              />
            </SplitViewCol>
            <SplitViewCol grow sep>
              <DocDiffSection diff={selectedItem.diff} />
              <SelectionSection selection={selectedItem.selection} />
              <SelectionContentSection
                selectionContent={selectedItem.selectionContent}
              />
              {!selectedItem.diff &&
                !selectedItem.selectionContent &&
                !selectedItem.diffPending && (
                  <InfoPanel>Docs are equal.</InfoPanel>
                )}
            </SplitViewCol>
          </SplitView>
        );
      }}
    </Subscribe>
  );
}
