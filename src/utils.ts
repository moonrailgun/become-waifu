export class FrameManager {
  active = false;
  timer: number | undefined;

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
    this.timer = window.requestAnimationFrame(() => {
      if (!this.active) {
        return;
      }

      const p = cb();
      if (p) {
        p.then(() => this.onFrame(cb));
      } else {
        this.onFrame(cb);
      }
    });
  };
}

/**
 * 媒体轨转媒体流
 */
export function trackToStream(track: MediaStreamTrack): MediaStream {
  return new MediaStream([track]);
}
