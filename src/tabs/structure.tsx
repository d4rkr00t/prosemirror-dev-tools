import React, { MouseEventHandler } from "react";
import "@compiled/react";
import { atom, useAtom, useAtomValue } from "jotai";
import type { Node } from "prosemirror-model";
import theme from "../theme";
import { SplitView, SplitViewCol } from "../components/split-view";
import JSONTree from "../components/json-tree";
import {
  Heading,
  HeadingWithButton,
  HeadingButton,
} from "../components/heading";
import { nodeColorsAtom } from "../state/node-colors";
import { editorStateAtom } from "../state/editor-state";
import { ExtendedFragment } from "../types/prosemirror";

const GraphWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      marginTop: "12px",
    }}
  >
    {children}
  </div>
);

const BlockNodeContentView = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      padding: "0 12px",
      boxSizing: "border-box",
      borderLeft: `1px solid ${theme.white20}`,
      borderRight: `1px solid ${theme.white20}`,
    }}
  >
    {children}
  </div>
);

const BlockNodeContentViewWithInline = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div
    css={{
      padding: "0 12px",
      display: "flex",
      width: "100%",
      boxSizing: "border-box",
      borderLeft: `1px solid ${theme.white20}`,
      borderRight: `1px solid ${theme.white20}`,
      flexWrap: "wrap",
    }}
  >
    {children}
  </div>
);

const BlockNodeView = ({
  children,
  bg,
  onClick,
}: {
  bg: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}) => (
  <div
    onClick={onClick}
    css={{
      width: "100%",
      marginBottom: "3px",
      boxSizing: "border-box",
      display: "flex",
      background: bg,

      "&:hover": {
        cursor: "pointer",
      },
    }}
  >
    {children}
  </div>
);

const Side = ({
  tooltip,
  children,
}: {
  tooltip: string;
  children: React.ReactNode;
}) => (
  <div
    title={tooltip}
    css={{
      padding: "3px 6px",
      background: "rgba(255, 255, 255, 0.3)",
    }}
  >
    {children}
  </div>
);

const StartSide = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      padding: "3px 6px",
      whiteSpace: "pre",
    }}
  >
    {children}
  </div>
);

const Bar = ({ children }: { children?: React.ReactNode }) => (
  <div
    css={{
      flexGrow: 1,
    }}
  >
    {children}
  </div>
);

const Center = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      flexGrow: 1,
      padding: "3px 9px",
      whiteSpace: "pre",
    }}
  >
    {children}
  </div>
);

const InlineNodeView = ({
  children,
  bg,
  onClick,
}: {
  bg: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}) => (
  <div
    onClick={onClick}
    css={{
      flexGrow: 1,
      marginBottom: "3px",
      display: "flex",
      boxSizing: "border-box",
      background: bg,

      "&:hover": {
        cursor: "pointer",
      },
    }}
  >
    {children}
  </div>
);

export function BlockNodeContent(props: {
  content: Node["content"];
  startPos: number;
  colors: Record<string, string>;
  onNodeSelected: (data: { node: Node }) => void;
}) {
  const fragment = props.content as unknown as ExtendedFragment;
  if (!fragment || !fragment.content || !fragment.content.length) {
    return null;
  }

  const content = fragment.content;

  if (content[0].isBlock) {
    let startPos = props.startPos + 1;
    return (
      <BlockNodeContentView>
        {content.map((childNode: Node, index: number) => {
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
      {content.map((childNode: Node, index: number) => {
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

export function BlockNode(props: {
  colors: Record<string, string>;
  node: Node;
  startPos: number;
  onNodeSelected: (data: { node: Node }) => void;
}) {
  const { colors, node, startPos } = props;
  const color = colors[node.type.name];
  const marks = getMarksText(node);
  return (
    <div>
      <BlockNodeView bg={color} onClick={() => props.onNodeSelected({ node })}>
        {startPos > 0 && (
          <Side
            tooltip={`Pos: ${startPos - 1} (before ${
              node.type.name
            } opening tag)`}
          >
            {startPos - 1}
          </Side>
        )}
        <StartSide>
          {node.type.name} {marks}
        </StartSide>
        <Side
          tooltip={`Pos: ${startPos} (after ${node.type.name} opening tag)`}
        >
          {startPos}
        </Side>
        <Bar />
        <Side
          tooltip={`Pos: ${startPos + node.nodeSize - 1} (after ${
            node.type.name
          } closing tag)`}
        >
          {startPos + node.nodeSize - 1}
        </Side>
      </BlockNodeView>
      <BlockNodeContent
        content={node.content}
        colors={colors}
        onNodeSelected={props.onNodeSelected}
        startPos={startPos}
      />
    </div>
  );
}

export function InlineNode(props: {
  node: Node;
  bg: string;
  startPos: number;
  index: number;
  onNodeSelected: (data: { node: Node }) => void;
}) {
  const { node, bg, startPos, index } = props;
  const marks = getMarksText(node);
  return (
    <InlineNodeView onClick={() => props.onNodeSelected({ node })} bg={bg}>
      {index === 0 ? (
        <Side
          tooltip={`Pos: ${startPos} (before ${node.type.name} opening tag)`}
        >
          {startPos}
        </Side>
      ) : null}
      <Center>
        {node.type.name} {marks}
      </Center>
      <Bar />
      <Side
        tooltip={`Pos: ${startPos + node.nodeSize} (before ${
          node.type.name
        } closing tag)`}
      >
        {startPos + node.nodeSize}
      </Side>
    </InlineNodeView>
  );
}

const structureTabSelectedNode = atom<Node | null>(null);

export default function GraphTab() {
  const [selectedNode, setSelectedNode] = useAtom(structureTabSelectedNode);
  const handleNodeSelect = React.useCallback(
    ({ node }: { node: Node }) => setSelectedNode(node),
    []
  );
  const nodeColors = useAtomValue(nodeColorsAtom);
  const state = useAtomValue(editorStateAtom);
  if (!state) return null;

  const selected = selectedNode ? selectedNode : state.doc;

  return (
    <SplitView testId="__prosemirror_devtools_tabs_structure__">
      <SplitViewCol grow>
        <Heading>Current Doc</Heading>
        <GraphWrapper>
          <BlockNode
            colors={nodeColors}
            node={state.doc}
            startPos={0}
            onNodeSelected={handleNodeSelect}
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
          shouldExpandNode={() => (selected.type.name !== "doc" ? true : false)}
        />
      </SplitViewCol>
    </SplitView>
  );
}

function getMarksText(node: Node) {
  return node.marks.length === 1
    ? ` - [${node.marks[0].type.name}]`
    : node.marks.length > 1
    ? ` - [${node.marks.length} marks]`
    : "";
}
