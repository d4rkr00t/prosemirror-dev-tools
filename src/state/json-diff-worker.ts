import type { Delta } from "jsondiffpatch";
// @ts-expect-error package doesn't provide types
import nanoid from "nanoid";
import { IdleScheduler } from "./idle-scheduler";

export class JsonDiffWorker {
  queue = new Map();
  scheduler = new IdleScheduler();
  worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;

    this.worker.addEventListener("message", (e) => {
      const deferred = this.queue.get(e.data.id);
      if (deferred) {
        this.queue.delete(e.data.id);
        deferred.resolve(e.data.returns);
      }
    });
  }

  async diff(input: unknown): Promise<{ id: string; delta?: Delta }> {
    await this.scheduler.request();

    const id = nanoid();
    const deferred = createDeferrable();
    this.queue.set(id, deferred);

    this.worker.postMessage({
      method: "diff",
      id,
      args: [input],
    });

    return deferred as any;
  }
}

function createDeferrable() {
  let r: (...args: any) => void;

  const p = new Promise((resolve) => {
    r = resolve;
  });

  (p as any).resolve = (...args: any) => r(...args);
  return p;
}
