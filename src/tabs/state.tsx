import React, { MouseEventHandler } from "react";
import "@compiled/react";
import { atom, useAtom, useAtomValue } from "jotai";
import {
  expandedStateFormatSelection,
  collapsedStateFormatSelection,
} from "../utils/format-selection-object";
import { SplitView, SplitViewCol } from "../components/split-view";
import JSONTree from "../components/json-tree";
import {
  Heading,
  HeadingWithButton,
  HeadingButton,
} from "../components/heading";
import theme from "../theme";
import { activeMarksAtom } from "../state/active-marks";
import { expandPathAtom } from "../state/expand-path";
import { editorStateAtom } from "../state/editor-state";
import { logNodeFromJSON } from "../utils/log-node-from-json";
import type { JSONMark, JSONNode } from "../types/prosemirror";

const JSONTreeWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      padding: "0 0 9px 0",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

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

const Group = ({ children }: { children: React.ReactNode }) => (
  <div css={{ margin: "0.5em 0px 0.5em 1em" }}>{children}</div>
);

const GroupRow = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      paddingTop: "0.25em",
    }}
  >
    {children}
  </div>
);

const Key = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      display: "inline-block",
      color: theme.syntax.base0D,
      margin: "0px 0.5em 0px 0px",
    }}
  >
    {children}
  </div>
);

const ValueNum = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      color: theme.syntax.base09,
    }}
  >
    {children}
  </div>
);

const LogNodeButton = ({
  children,
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <button
    data-test-id="__prosemirror_devtools_log_node_button__"
    onClick={onClick}
    css={{
      color: theme.white60,
      background: "none",
      border: "none",
      transition: "background 0.3s, color 0.3s",
      borderRadius: "3px",

      "&:hover": {
        cursor: "pointer",
        background: theme.main40,
        color: theme.text,
      },

      "&:focus": {
        outline: "none",
      },
    }}
  >
    {children}
  </button>
);

export function getItemString(
  doc: JSONNode,
  action: (args: { doc: JSONNode; node: JSONNode }) => void,
) {
  return function getItemStringWithBindedDoc(
    type: string,
    value: JSONNode,
    defaultView: unknown,
    keysCount: string,
  ) {
    const logButton = (
      <LogNodeButton
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          action({ doc, node: value });
        }}
      >
        log
      </LogNodeButton>
    );

    if (type === "Object" && value.type) {
      return (
        <span>
          {"{} "}
          {value.type} {logButton}
        </span>
      );
    }

    return (
      <span>
        <>
          {defaultView} {keysCount} {logButton}
        </>
      </span>
    );
  };
}

function getItemStringForMark(
  type: string,
  value: JSONMark,
  defaultView: unknown,
  keysCount: string,
) {
  if (type === "Object" && value.type) {
    return (
      <span>
        {"{} "}
        {value.type}
      </span>
    );
  }

  return (
    <span>
      <>
        {defaultView} {keysCount}
      </>
    </span>
  );
}

export function shouldExpandNode(
  expandPath: Array<string | number>,
  nodePath: Array<string | number>,
) {
  const path = ([] as Array<string | number>).concat(nodePath).reverse();

  if (!expandPath) return false;

  // Expand attrs if node has them.
  // expandPath.push("attrs");

  if (path.length > expandPath.length) return false;
  if (path.join(".") === expandPath.join(".")) return true;
  if (path.every((el, idx) => el === expandPath[idx])) return true;
  return false;
}

const selectionAtom = atom(false);

export default function StateTab() {
  const [selectionExpanded, setExpanded] = useAtom(selectionAtom);
  const activeMarks = useAtomValue(activeMarksAtom);
  const expandPath = useAtomValue(expandPathAtom);
  const state = useAtomValue(editorStateAtom);
  const doc = state?.doc.toJSON();

  if (!state) return null;

  const logNode = logNodeFromJSON(state);

  return (
    <SplitView testId="__prosemirror_devtools_tabs_state__">
      <SplitViewCol grow>
        <HeadingWithButton>
          <Heading>Current Doc</Heading>
          <HeadingButton onClick={() => console.log(state)}>
            Log State
          </HeadingButton>
        </HeadingWithButton>
        <JSONTree
          data={doc}
          hideRoot
          getItemString={getItemString(doc, logNode)}
          shouldExpandNode={(nodePath: Array<string | number>) =>
            shouldExpandNode(expandPath, nodePath)
          }
        />
      </SplitViewCol>
      <SplitViewCol sep minWidth={220}>
        <Section>
          <HeadingWithButton>
            <Heading>Selection</Heading>
            <HeadingButton onClick={() => setExpanded(!selectionExpanded)}>
              {selectionExpanded ? "▼" : "▶"}
            </HeadingButton>
          </HeadingWithButton>
          <JSONTreeWrapper>
            <JSONTree
              data={
                selectionExpanded
                  ? expandedStateFormatSelection(state.selection)
                  : collapsedStateFormatSelection(state.selection)
              }
              hideRoot
            />
          </JSONTreeWrapper>
        </Section>
        <Section>
          <Heading>Active Marks</Heading>
          <JSONTreeWrapper>
            {activeMarks.length ? (
              <JSONTree
                data={activeMarks}
                hideRoot
                getItemString={getItemStringForMark}
              />
            ) : (
              <Group>
                <GroupRow>
                  <Key>no active marks</Key>
                </GroupRow>
              </Group>
            )}
          </JSONTreeWrapper>
        </Section>
        <Section>
          <Heading>Document Stats</Heading>
          <Group>
            <GroupRow>
              <Key>nodeSize:</Key>
              <ValueNum>{state.doc.nodeSize}</ValueNum>
            </GroupRow>
            <GroupRow>
              <Key>childCount:</Key>
              <ValueNum>{state.doc.childCount}</ValueNum>
            </GroupRow>
          </Group>
        </Section>
      </SplitViewCol>
    </SplitView>
  );
}
