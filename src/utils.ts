export class FrameManager {
  active = false;

  /**
   * 开启桢循环
   */
  start(cb: () => void | Promise<void>) {
    this.active = true;
    this.onFrame(cb);
  }

  stop() {
    this.active = false;
  }

  onFrame = (cb: () => void | Promise<void>) => {
    window.requestAnimationFrame(() => {
      const p = cb();
      if (p) {
        p.then(() => this.onFrame(cb));
      } else {
        this.onFrame(cb);
      }
    });
  };
}
