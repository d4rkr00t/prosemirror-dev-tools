import React from "react";
import styled from "styled-components";
import processSelection from "./utils/process-selection";
import { SplitView, SplitViewCol } from "./split-view";
import JSONTree from "./json-tree";
import Button from "./button";

const Heading = styled.h2`
  padding: 0;
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 13px;
  color: #BB91A3;
  text-transform: uppercase;
  flex-grow: 1;
`;

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

const HeadingWithButton = styled.div`
  display: flex;
`;

const HeadingButton = styled.button`
  padding: 6px 10px;
  margin: -6px -10px 0 8px;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 11px;
  color: rgba(255, 255, 255, .8);
  text-transform: uppercase;
  transition: background .3s, color .3s;
  border-radius: 2px;
  border: none;
  background: transparent;

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

const Group = styled.div`
  margin: 0.5em 0px 0.5em 1em;
`;

const GroupRow = styled.div`
  padding-top: 0.25em;
`;

const Key = styled.span`
  display: inline-block;
  color: rgb(102, 217, 239);
  margin: 0px 0.5em 0px 0px;
`;

const ValueNum = styled.span`
  color: rgb(253, 151, 31);
`;

export function getItemString(type, value, defaultView, keysCount) {
  if (type === "Object" && value.type) {
    return <span>{"{}"} {value.type}</span>;
  }

  return <span>{defaultView} {keysCount}</span>;
}

export class Selection extends React.PureComponent {
  constructor() {
    super();
    this.state = { expanded: false };
  }

  render() {
    const { selection } = this.props;
    const { expanded } = this.state;
    return (
      <div>
        <HeadingWithButton>
          <Heading>Selection</Heading>
          <HeadingButton onClick={() => this.setState({ expanded: !expanded })}>
            {expanded ? "▼" : "▶"}
          </HeadingButton>
        </HeadingWithButton>
        <JSONTreeWrapper>
          <JSONTree
            data={expanded ? processSelection(selection) : selection.toJSON()}
            hideRoot
          />
        </JSONTreeWrapper>
      </div>
    );
  }
}

export default function StateView(props) {
  return (
    <SplitView>
      <SplitViewCol grow>
        <Heading>Current State</Heading>
        <JSONTree
          data={props.doc.toJSON()}
          hideRoot
          getItemString={getItemString}
        />
      </SplitViewCol>
      <SplitViewCol sep>
        <Section>
          <Selection selection={props.selection} />
        </Section>
        <Section>
          <Heading>Document</Heading>
          <Group>
            <GroupRow>
              <Key>nodeSize:</Key>
              <ValueNum>{props.doc.nodeSize}</ValueNum>
            </GroupRow>
            <GroupRow>
              <Key>childCount:</Key>
              <ValueNum>{props.doc.childCount}</ValueNum>
            </GroupRow>
          </Group>
        </Section>
      </SplitViewCol>
    </SplitView>
  );
}
