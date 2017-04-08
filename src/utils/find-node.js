function findNode(fullPath, currentNode, nodeToFind) {
  if (nodeToFind === currentNode) {
    return fullPath;
  }

  if (!currentNode.content || !currentNode.content.content) return null;

  const res = currentNode.content.content
    .map((currentNode, i) =>
      findNode([].concat(fullPath, "content", i), currentNode, nodeToFind))
    .filter(res => Array.isArray(res) && res.length)[0];

  return res;
}

export default function findNodeIn(doc, node) {
  let path = findNode([], doc, node);

  if (path) {
    return path.reduce(
      (newPath, item) => {
        // [0, content, content, 0] => [0, content, 0]
        // Because JSON representation a bit different from actual DOC.
        if (item === "content" && newPath[newPath.length - 1] === "content") {
          return newPath;
        }

        newPath.push(item);
        return newPath;
      },
      []
    );
  }
}
