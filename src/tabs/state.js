import React from "react";
import styled from "styled-components";
import { Subscribe } from "unstated";
import EditorStateContainer from "../state/editor";
import StateTabStateContainer from "../state/state-tab";
import {
  expandedStateFormatSelection,
  collapsedStateFormatSelection
} from "./../utils/format-selection-object";
import { SplitView, SplitViewCol } from "../components/split-view";
import JSONTree from "../components/json-tree";
import {
  Heading,
  HeadingWithButton,
  HeadingButton
} from "./../components/heading";

const JSONTreeWrapper = styled.div`
  padding: 0 0 9px 0;
  overflow: hidden;
`;

const Section = styled.div`
  min-width: 180px;
  box-sizing: border-box;

  & + & {
    padding-top: 9px;
  }
`;

const Group = styled.div`
  margin: 0.5em 0px 0.5em 1em;
`;

const GroupRow = styled.div`
  padding-top: 0.25em;
`;

const Key = styled.span`
  display: inline-block;
  color: ${props => props.theme.syntax.base0D};
  margin: 0px 0.5em 0px 0px;
`;

const ValueNum = styled.span`
  color: ${props => props.theme.syntax.base09};
`;

const LogNodeButton = styled.button`
  color: ${props => props.theme.white60};
  background: none;
  border: none;
  transition: background 0.3s, color 0.3s;
  border-radius: 3px;

  &:hover {
    cursor: pointer;
    background: ${props => props.theme.main40};
    color: ${props => props.theme.white};
  }

  &:focus {
    outline: none;
  }
`;

export function getItemString(doc, action) {
  return function getItemStringWithBindedDoc(
    type,
    value,
    defaultView,
    keysCount
  ) {
    const logButton = (
      <LogNodeButton
        onClick={e => {
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
        {defaultView} {keysCount} {logButton}
      </span>
    );
  };
}

function getItemStringForMark(type, value, defaultView, keysCount) {
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
      {defaultView} {keysCount}
    </span>
  );
}

export function shouldExpandNode(expandPath, nodePath) {
  const path = [].concat(nodePath).reverse();

  if (!expandPath) return false;

  // Expand attrs if node has them.
  expandPath.push("attrs");

  if (path.length > expandPath.length) return false;
  if (path.join(".") === expandPath.join(".")) return true;
  if (path.every((el, idx) => el === expandPath[idx])) return true;
  return false;
}

export default function StateTab() {
  return (
    <Subscribe to={[EditorStateContainer, StateTabStateContainer]}>
      {(editorState, stateTab) => {
        const { logNodeFromJSON } = editorState;
        const { state, activeMarks, expandPath } = editorState.state;
        const { toggleSelection } = stateTab;
        const { selectionExpanded } = stateTab.state;
        const doc = state.doc.toJSON();

        return (
          <SplitView>
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
                getItemString={getItemString(doc, logNodeFromJSON)}
                shouldExpandNode={nodePath =>
                  shouldExpandNode(expandPath, nodePath)
                }
              />
            </SplitViewCol>
            <SplitViewCol sep minWidth={220}>
              <Section>
                <HeadingWithButton>
                  <Heading>Selection</Heading>
                  <HeadingButton onClick={() => toggleSelection()}>
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
      }}
    </Subscribe>
  );
}
