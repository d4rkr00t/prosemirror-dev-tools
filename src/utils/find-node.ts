import type { Node } from "prosemirror-model";
import type { ExtendedFragment, JSONNode } from "../types/prosemirror";

function findNode(
  fullPath: Array<string | number>,
  currentNode: Node,
  nodeToFind: Node
): Array<string | number> | null {
  if (nodeToFind === currentNode) {
    return fullPath;
  }

  const fragment = currentNode.content as unknown as ExtendedFragment;

  if (!fragment || !fragment.content) return null;

  const res = fragment.content
    .map((currentNode: Node, i: number) =>
      findNode([...fullPath, "content", i], currentNode, nodeToFind)
    )
    .filter((res) => Array.isArray(res) && res.length)[0];

  return res;
}

export default function findNodeIn(doc: Node, node: Node) {
  const path = findNode([], doc, node);

  if (path) {
    return path.reduce<Array<string | number>>((newPath, item) => {
      // [0, content, content, 0] => [0, content, 0]
      // Because JSON representation a bit different from actual DOC.
      if (item === "content" && newPath[newPath.length - 1] === "content") {
        return newPath;
      }

      newPath.push(item);
      return newPath;
    }, []);
  }
}

export function findNodeJSON(
  fullPath: Array<string | number>,
  currentNode: JSONNode,
  nodeToFind: JSONNode | Array<JSONNode>
): Array<string | number> {
  if (nodeToFind === currentNode) {
    return fullPath;
  }

  if (!currentNode.content) return [];

  if (currentNode.content === nodeToFind) {
    return fullPath.concat("content");
  }

  const res = currentNode.content
    .map((currentNode, i) =>
      findNodeJSON([...fullPath, "content", i], currentNode, nodeToFind)
    )
    .filter((res) => Array.isArray(res) && res.length)[0];

  return res;
}

export function findPMNode(domNode: HTMLElement) {
  let node;
  let target: HTMLElement | null = domNode;

  while (!node && target) {
    if ((target as any).pmViewDesc) {
      node = target;
    }
    target = target.parentNode as HTMLElement;
  }

  return node;
}
