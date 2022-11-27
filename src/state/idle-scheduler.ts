import type { ExtendedWindow } from "../types/window";

export class IdleScheduler {
  task = undefined;

  request() {
    this.cancel();
    const request = window.requestIdleCallback || window.requestAnimationFrame;
    return new Promise((resolve) => request(resolve));
  }

  cancel() {
    const cancel =
      (window as unknown as ExtendedWindow).cancelIdleCallack ||
      window.cancelAnimationFrame;
    if (this.task) {
      cancel(this.task);
    }
  }
}
