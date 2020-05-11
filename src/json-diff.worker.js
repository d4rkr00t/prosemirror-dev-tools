import { DiffPatcher } from "jsondiffpatch";

const diffPatcher = new DiffPatcher({
  arrays: { detectMove: false },
  textDiff: { minLength: 1 }
});

self.addEventListener("message", e => {
  if (!e.data.id || !e.data.method || !e.data.args) {
    return;
  }

  switch (e.data.method) {
    case "diff": {
      const [{ a, b, id }] = e.data.args;

      self.postMessage({
        id: e.data.id,
        returns: {
          id,
          delta: diffPatcher.diff(a, b)
        }
      });
      break;
    }
    default:
      throw new Error("unknown method", e.data.method);
  }
});
