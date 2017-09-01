import React from "react";
import styled from "styled-components";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";

import { SplitView, SplitViewCol } from "../components/split-view";
import JSONTree from "../components/json-tree";
import {
  Heading,
  HeadingWithButton,
  HeadingButton
} from "./../components/heading";

const GraphWrapper = styled.div`margin-top: 12px;`;

const BlockNodeWrapper = styled.div``;

const BlockNodeContentView = styled.div`
  padding: 0 12px;
  box-sizing: border-box;
  border-left: 1px solid ${props => props.theme.white20};
  border-right: 1px solid ${props => props.theme.white20};
`;

const BlockNodeContentViewWithInline = styled.div`
  padding: 0 12px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  border-left: 1px solid ${props => props.theme.white20};
  border-right: 1px solid ${props => props.theme.white20};
  flex-wrap: wrap;
`;

const BlockNodeView = styled.div`
  width: 100%;
  background: ${props => props.bg};
  margin-bottom: 3px;
  box-sizing: border-box;
  display: flex;
`;

const Side = styled.div`
  padding: 3px 6px;
  background: rgba(255, 255, 255, .3);
`;

const Center = styled.div`
  flex-grow: 1;
  padding: 3px 9px;
  white-space: pre;
`;

const InlineNodeView = styled.div`
  flex-grow: 1;
  background: ${props => props.bg};
  margin-bottom: 3px;
  display: flex;
  box-sizing: border-box;
`;

export function BlockNodeContent(props) {
  if (!props.content || !props.content.content || !props.content.content.length)
    return null;

  const content = props.content.content;

  if (content[0].isBlock) {
    let startPos = props.startPos + 1;
    return (
      <BlockNodeContentView>
        {content.map((childNode, index) => {
          const pos = startPos;
          startPos += childNode.nodeSize;
          return (
            <BlockNode
              key={index}
              node={childNode}
              colors={props.colors}
              onNodeSelected={props.onNodeSelected}
              startPos={pos}
            />
          );
        })}
      </BlockNodeContentView>
    );
  }

  let startPos = props.startPos;
  return (
    <BlockNodeContentViewWithInline>
      {content.map((childNode, index) => {
        const pos = startPos;
        startPos += childNode.nodeSize;
        return (
          <InlineNode
            key={index}
            index={index}
            node={childNode}
            bg={props.colors[childNode.type.name]}
            onNodeSelected={props.onNodeSelected}
            startPos={pos}
          />
        );
      })}
    </BlockNodeContentViewWithInline>
  );
}

export function BlockNode(props) {
  const { colors, node, startPos } = props;
  const color = colors[node.type.name];
  return (
    <BlockNodeWrapper>
      <BlockNodeView bg={color} onClick={() => props.onNodeSelected({ node })}>
        <Side>
          {startPos}
        </Side>
        <Center>
          {node.type.name}
        </Center>
        <Side>
          {startPos + node.nodeSize - 1}
        </Side>
      </BlockNodeView>
      <BlockNodeContent
        content={node.content}
        colors={colors}
        onNodeSelected={props.onNodeSelected}
        startPos={startPos}
      />
    </BlockNodeWrapper>
  );
}

export function InlineNode(props) {
  const { node, bg, startPos, index } = props;
  const marks =
    node.marks.length === 1
      ? ` - [${node.marks[0].type.name}]`
      : node.marks.length > 1 ? ` - [${node.marks.length} marks]` : "";
  return (
    <InlineNodeView onClick={() => props.onNodeSelected({ node })} bg={bg}>
      {index === 0
        ? <Side>
            {startPos}
          </Side>
        : null}
      <Center>
        {node.type.name} {marks}
      </Center>
      <Side>
        {startPos + node.nodeSize}
      </Side>
    </InlineNodeView>
  );
}

export default connect(
  {
    state: state`editor.state`,
    selectedNode: state`structureTab.selectedNode`,
    colors: state`structureTab.colors`,
    nodeSelected: signal`structureTab.nodeSelected`
  },
  function GraphTab({ state, colors, selectedNode, nodeSelected }) {
    const selected = selectedNode ? selectedNode : state.doc;
    return (
      <SplitView>
        <SplitViewCol grow>
          <Heading>Current Doc</Heading>
          <GraphWrapper>
            <BlockNode
              colors={colors}
              node={state.doc}
              startPos={0}
              onNodeSelected={nodeSelected}
            />
          </GraphWrapper>
        </SplitViewCol>
        <SplitViewCol sep minWidth={200} maxWidth={300}>
          <HeadingWithButton>
            <Heading>Node Info</Heading>
            <HeadingButton onClick={() => console.log(selected)}>
              Log Node
            </HeadingButton>
          </HeadingWithButton>
          <JSONTree
            data={selected.toJSON()}
            hideRoot
            shouldExpandNode={() =>
              selected.type.name !== "doc" ? true : false}
          />
        </SplitViewCol>
      </SplitView>
    );
  }
);
