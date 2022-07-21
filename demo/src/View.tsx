import { useEffect, useRef } from 'preact/hooks';
import { Camera } from '@mediapipe/camera_utils';
import { becomeWaifu } from '../../src/index';

export function View() {
  const outputRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    (async () => {
      if (outputRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        const waifuTrack = await becomeWaifu({
          modelSource:
            // 'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json',
            '/live2d/hiyori/hiyori_pro_t10.model3.json',
          videoMediaTrack: stream.getVideoTracks()[0],
        });

        outputRef.current.srcObject = new MediaStream([waifuTrack]);
        outputRef.current.autoplay = true;
      }
    })();
  }, []);

  return (
    <>
      <video ref={outputRef} />
    </>
  );
}
