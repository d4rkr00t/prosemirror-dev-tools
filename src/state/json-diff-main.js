import { DiffPatcher } from "jsondiffpatch";

export class JsonDiffMain {
  diffPatcher = new DiffPatcher({
    arrays: { detectMove: false },
    textDiff: { minLength: 1 }
  });

  diff(input) {
    return Promise.resolve({
      id: input.id,
      delta: this.diffPatcher.diff(input.a, input.b)
    });
  }
}
