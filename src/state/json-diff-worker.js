import { DiffPatcher } from "jsondiffpatch";
import nanoid from "nanoid";

export class JsonDiffWorker {
  queue = new Map();

  constructor() {
    try {
      this.worker = new Worker("./json-diff.worker.js");
    } catch (err) {
      console.warn(
        "Could not start json-diff worker, diffing on main thread",
        err
      );
    }

    if (!this.worker) {
      this.diffPatcher = new DiffPatcher({
        arrays: { detectMove: false },
        textDiff: { minLength: 1 }
      });
    }

    if (this.worker) {
      this.worker.addEventListener("message", e => {
        const deferred = this.queue.get(e.data.id);
        if (deferred) {
          this.queue.delete(e.data.id);
          deferred.resolve(e.data.returns);
        }
      });
    }
  }

  diff(input) {
    if (!this.worker) {
      return Promise.resolve({
        id: input.id,
        delta: this.diffPatcher.diff(input.a, input.b)
      });
    }

    const id = nanoid();
    const deferred = createDeferrable();
    this.queue.set(id, deferred);

    this.worker.postMessage({
      method: "diff",
      id,
      args: [input]
    });

    return deferred;
  }
}

function createDeferrable() {
  let r;

  const p = new Promise(resolve => {
    r = resolve;
  });

  p.resolve = (...args) => r(...args);
  return p;
}
