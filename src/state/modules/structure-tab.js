const nodesColors = [
  "#EA7C7F", // red
  "#67B0C6", // cyan 400
  "#94BB7F", // green
  "#CA9EDB", // deep purple
  "#DCDC5D", // lime
  "#B9CC7C", // light green
  "#DD97D8", // purple
  "#FFB761", // orange
  "#4D8FD1", // light blue
  "#F36E98", // pink
  "#E45F44", // deep orange
  "#A6A4AE", // blue grey
  "#FCC047", // yellow
  "#FFC129", // amber
  "#D3929C", // can can
  "#4CBCD4", // cyan
  "#8D7BC0" // indigo
];

export function calculateSafeIndex(index, total) {
  const quotient = index / total;
  return Math.round(total * (quotient - Math.floor(quotient)));
}

export function buildColors(schema) {
  return Object.keys(schema.nodes).reduce(
    (acc, node, index) => {
      const safeIndex = index >= nodesColors.length
        ? calculateSafeIndex(index, nodesColors.length)
        : index;

      acc[node] = nodesColors[safeIndex];
      return acc;
    },
    {}
  );
}

export function updateColors({ state, props }) {
  const { schema } = props;
  state.set("structureTab.colors", buildColors(schema));
}

export function selectNode({ state, props }) {
  state.set("structureTab.selectedNode", props.node);
}

export default function createStructureTabPlugin(schema) {
  return {
    state: {
      colors: buildColors(schema),
      selectedNode: null
    },
    signals: {
      schemaUpdated: updateColors,
      nodeSelected: selectNode
    }
  };
}
