export class IdleScheduler {
  task = undefined;

  request() {
    this.cancel();
    const request = window.requestIdleCallback || window.requestAnimationFrame;
    return new Promise((resolve) => request(resolve));
  }

  cancel() {
    const cancel = window.cancelIdleCallack || window.cancelAnimationFrame;
    if (this.task) {
      cancel(this.task);
    }
  }
}
