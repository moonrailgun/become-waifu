import { useEffect, useRef } from 'preact/hooks';
import { Camera } from '@mediapipe/camera_utils';
import { becomeWaifu } from '../../src/index';

export function View() {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const outputRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (webcamRef.current) {
      const camera = new Camera(webcamRef.current, {
        onFrame: async () => {
          // console.log('fooooo');
        },
        width: 640,
        height: 480,
      });
      camera.start();

      webcamRef.current.addEventListener('play', async (e) => {
        // @ts-ignore
        const stream = webcamRef.current.captureStream(30);
        const waifuTrack = await becomeWaifu({
          modelSource:
            'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json',
          videoMediaTrack: stream.getVideoTracks()[0],
        });

        if (outputRef.current) {
          outputRef.current.srcObject = new MediaStream([waifuTrack]);
          outputRef.current.autoplay = true;
        }
      });
    }
  }, []);

  return (
    <>
      <video ref={webcamRef} style={{ display: 'none' }} />
      <video ref={outputRef} />
    </>
  );
}
