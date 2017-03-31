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
  & + & {
    padding-top: 9px;
  }
`;

const HeadingWithButton = styled.div`
  display: flex;
`;

const HeadingButton = styled.button`
  padding: 4px 8px;
  margin: -5px -8px 0 8px;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 13px;
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
        <JSONTree data={props.doc.toJSON()} hideRoot />
      </SplitViewCol>
      <SplitViewCol sep>
        <Section>
          <Selection selection={props.selection} />
        </Section>
        <Section>
          <Heading>Document</Heading>
        </Section>
      </SplitViewCol>
    </SplitView>
  );
}
