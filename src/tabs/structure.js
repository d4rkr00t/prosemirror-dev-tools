import React from "react";
import styled from "styled-components";
import { connect } from "cerebral/react";
import { state, signal } from "cerebral/tags";
import { SplitView, SplitViewCol } from "./../split-view";
import { Heading } from "./../components/heading";
import JSONTree from "./../json-tree";

const GraphWrapper = styled.div`
  margin-top: 12px;
`;

const BlockNodeWrapper = styled.div``;

const BlockNodeContentView = styled.div`
  padding: 0 0 0 12px;
  box-sizing: border-box;
  border-left: 1px solid rgba(255, 255, 255, .2);
`;

const BlockNodeContentViewWithInline = styled.div`
  padding: 0 0 0 12px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  border-left: 1px solid rgba(255, 255, 255, .2);
`;

const BlockNodeView = styled.div`
  width: 100%;
  padding: 3px 12px;
  background: ${props => props.bg};
  margin-bottom: 3px;
  box-sizing: border-box;
`;

const InlineNodeView = styled.div`
  flex-grow: 1;
  padding: 3px 12px;
  background: ${props => props.bg};
  margin-left: 3px;
  margin-bottom: 3px;
  box-sizing: border-box;
`;

export function BlockNodeContent(props) {
  if (!props.content || !props.content.content || !props.content.content.length)
    return null;

  const content = props.content.content;

  if (content[0].isBlock) {
    return (
      <BlockNodeContentView>
        {content.map((childNode, index) => (
          <BlockNode
            key={index}
            node={childNode}
            colors={props.colors}
            onNodeSelected={props.onNodeSelected}
          />
        ))}
      </BlockNodeContentView>
    );
  }

  return (
    <BlockNodeContentViewWithInline>
      {content.map((childNode, index) => (
        <InlineNode
          key={index}
          node={childNode}
          bg={props.colors[childNode.type.name]}
          onNodeSelected={props.onNodeSelected}
        />
      ))}
    </BlockNodeContentViewWithInline>
  );
}

export function BlockNode(props) {
  const { colors, node } = props;
  const color = colors[node.type.name];
  return (
    <BlockNodeWrapper>
      <BlockNodeView bg={color} onClick={() => props.onNodeSelected({ node })}>
        {props.node.type.name}
      </BlockNodeView>
      <BlockNodeContent
        content={node.content}
        colors={colors}
        onNodeSelected={props.onNodeSelected}
      />
    </BlockNodeWrapper>
  );
}

export function InlineNode(props) {
  const { node, bg } = props;
  const marks = node.marks.length === 1
    ? ` - [${node.marks[0].type.name}]`
    : node.marks.length > 1 ? ` - [${node.marks.length} marks]` : "";
  return (
    <InlineNodeView onClick={() => props.onNodeSelected({ node })} bg={bg}>
      {node.type.name} {marks}
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
    return (
      <SplitView>
        <SplitViewCol grow>
          <Heading>Current Doc</Heading>
          <GraphWrapper>
            <BlockNode
              colors={colors}
              node={state.doc}
              onNodeSelected={nodeSelected}
            />
          </GraphWrapper>
        </SplitViewCol>
        <SplitViewCol sep minWidth={200} maxWidth={300}>
          <Heading>Node Info</Heading>
          <JSONTree
            data={selectedNode ? selectedNode.toJSON() : state.doc.toJSON()}
            hideRoot
            shouldExpandNode={() =>
              selectedNode && selectedNode.type.name !== "doc" ? true : false}
          />
        </SplitViewCol>
      </SplitView>
    );
  }
);
