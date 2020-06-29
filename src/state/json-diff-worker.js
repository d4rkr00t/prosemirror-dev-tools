import nanoid from "nanoid";
import { IdleScheduler } from "./idle-scheduler";

export class JsonDiffWorker {
  queue = new Map();
  scheduler = new IdleScheduler();

  constructor(worker) {
    this.worker = worker;

    this.worker.addEventListener("message", (e) => {
      const deferred = this.queue.get(e.data.id);
      if (deferred) {
        this.queue.delete(e.data.id);
        deferred.resolve(e.data.returns);
      }
    });
  }

  async diff(input) {
    await this.scheduler.request();

    const id = nanoid();
    const deferred = createDeferrable();
    this.queue.set(id, deferred);

    this.worker.postMessage({
      method: "diff",
      id,
      args: [input],
    });

    return deferred;
  }
}

function createDeferrable() {
  let r;

  const p = new Promise((resolve) => {
    r = resolve;
  });

  p.resolve = (...args) => r(...args);
  return p;
}
