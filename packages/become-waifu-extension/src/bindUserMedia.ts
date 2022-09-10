/**
 * 绑定用户媒体
 */
export function bindUserMedia(el: HTMLCanvasElement) {
  const originFn = navigator.mediaDevices.getUserMedia;
  navigator.mediaDevices.getUserMedia = async function (
    constraints?: MediaStreamConstraints
  ): Promise<MediaStream> {
    const res: MediaStream = await originFn.call(this, constraints);
    if (constraints?.video) {
      res.getVideoTracks = function () {
        return el.captureStream(30).getVideoTracks();
      };
    }

    return res;
  };
}
