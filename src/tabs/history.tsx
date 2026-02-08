import React from "react";
import "@compiled/react";
import { InfoPanel } from "../components/info-panel";
import { Heading } from "../components/heading";
import { List } from "../components/list";
import JSONDiff from "../components/json-diff";
import { SplitView, SplitViewCol } from "../components/split-view";
import { Highlighter } from "../components/highlighter";
import theme from "../theme";
import { atom, useAtom, useAtomValue } from "jotai";
import {
  historyAtom,
  historyDiffsAtom,
  HistoryItem,
  historyRolledBackToAtom,
} from "../state/history";
import type { Selection } from "prosemirror-state";

const Section = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      minWidth: "180px",
      boxSizing: "border-box",

      "& + &": {
        paddingTop: "9px",
      },
    }}
  >
    {children}
  </div>
);

function pad(num: number) {
  return ("00" + num).slice(-2);
}

function pad3(num: number) {
  return ("000" + num).slice(-3);
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
    pad3(date.getMilliseconds()),
  ].join(":");
};

export function SelectionContentSection(props: {
  selectionContent?: string[] | string;
}) {
  if (!props.selectionContent) return null;

  const content = Array.isArray(props.selectionContent)
    ? props.selectionContent.join("\n")
    : props.selectionContent;

  return (
    <Section>
      <Heading>Selection Content</Heading>
      <Highlighter>{content}</Highlighter>
    </Section>
  );
}

export function DocDiffSection(props: { diff?: unknown }) {
  if (!props.diff) return null;

  return (
    <Section>
      <Heading>Doc diff</Heading>
      <JSONDiff delta={props.diff} />
    </Section>
  );
}

export function SelectionSection(props: { selection?: Selection }) {
  if (!props.selection) return null;

  return (
    <Section>
      <Heading>Selection diff</Heading>
      <JSONDiff delta={props.selection} />
    </Section>
  );
}

const selectedHistoryItemAtom = atom(0);
export default function HistoryView({
  rollbackHistory,
}: {
  rollbackHistory: (item: HistoryItem, index: number) => void;
}) {
  const [selectedHistoryItem, setSelectedHistoryItem] = useAtom(
    selectedHistoryItemAtom,
  );
  const historyRolledBackTo = useAtomValue(historyRolledBackToAtom);
  const history = useAtomValue(historyAtom);
  const historyDiffs = useAtomValue(historyDiffsAtom);
  const prevItem = history[selectedHistoryItem + 1];
  const selectedItem = history[selectedHistoryItem] ?? history[0];
  const selectedDiff = historyDiffs[selectedItem.id];
  const historyRolledBackToItem =
    historyRolledBackTo !== null ? history[historyRolledBackTo] : null;
  const historyList = history
    .reduce<Array<HistoryItem | Array<HistoryItem>>>((h, item, index) => {
      const prev = h[h.length - 1];

      item.index = index;

      if (!historyDiffs[item.id]?.diff) {
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
    .reduce<Array<HistoryItem | Array<HistoryItem>>>((h, item) => {
      if (Array.isArray(item) && item.length === 1) {
        h.push(item[0]);
      } else {
        h.push(item);
      }
      return h;
    }, []);

  const isSelected = (item: HistoryItem | HistoryItem[]) => {
    if (Array.isArray(item)) return false;
    return item.timestamp === selectedItem.timestamp;
  };
  const isPrevious = (item: HistoryItem | HistoryItem[]) => {
    if (Array.isArray(item)) return false;
    return prevItem && item.timestamp === prevItem.timestamp;
  };
  const isDimmed = (item: HistoryItem | HistoryItem[]) => {
    if (Array.isArray(item)) return false;
    return historyRolledBackToItem
      ? item.timestamp > historyRolledBackToItem.timestamp
      : false;
  };

  return (
    <SplitView testId="__prosemirror_devtools_tabs_history__">
      <SplitViewCol noPaddings minWidth={190}>
        <List<HistoryItem | Array<HistoryItem>>
          items={historyList}
          getKey={(item) => {
            if (Array.isArray(item)) {
              return "" + item[0].timestamp;
            }
            return "" + item.timestamp;
          }}
          title={(item) => {
            if (Array.isArray(item)) {
              return formatTimestamp(item[0].timestamp);
            }
            return formatTimestamp(item.timestamp);
          }}
          groupTitle={(item) => {
            if (Array.isArray(item)) {
              return formatTimestamp(item[0].timestamp) + ` [${item.length}]`;
            }
            return formatTimestamp(item.timestamp);
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
          onListItemClick={(item) => {
            if (Array.isArray(item)) return;
            setSelectedHistoryItem(item.index!);
          }}
          onListItemDoubleClick={(item) => {
            if (Array.isArray(item)) return;
            rollbackHistory(item, item.index!);
          }}
        />
      </SplitViewCol>
      <SplitViewCol grow sep>
        <DocDiffSection diff={selectedDiff} />
        <SelectionSection selection={selectedItem.selection} />
        <SelectionContentSection
          selectionContent={selectedItem.selectionContent}
        />
        {!selectedDiff && !selectedItem.selectionContent && (
          <InfoPanel>Docs are equal.</InfoPanel>
        )}
      </SplitViewCol>
    </SplitView>
  );
}
