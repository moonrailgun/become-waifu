import { useEffect, useRef } from 'preact/hooks';
import { Camera } from '@mediapipe/camera_utils';

export function View() {
  const webcamRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (webcamRef.current) {
      const camera = new Camera(webcamRef.current, {
        onFrame: async () => {
          console.log('fooooo');
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return <video ref={webcamRef}></video>;
}
