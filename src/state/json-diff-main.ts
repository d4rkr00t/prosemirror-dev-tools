import { DiffPatcher } from "jsondiffpatch";
import { IdleScheduler } from "./idle-scheduler";

export class JsonDiffMain {
  diffPatcher = new DiffPatcher({
    arrays: { detectMove: false, includeValueOnMove: false },
    textDiff: { minLength: 1 },
  });

  scheduler = new IdleScheduler();

  async diff(input: { id: string; a: unknown; b: unknown }) {
    await this.scheduler.request();

    return {
      id: input.id,
      delta: this.diffPatcher.diff(input.a, input.b),
    };
  }
}
