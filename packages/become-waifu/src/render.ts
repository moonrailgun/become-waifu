import type { ModelSettings } from 'pixi-live2d-display';
import { BecomeWaifu, FaceStatus } from './BecomeWaifu';

export interface BecomeWaifuOptions {
  videoMediaTrack: MediaStreamTrack;
  modelSource: string | object | ModelSettings;
  frameRequestRate?: number;
  onFaceStatusUpdated?: (faceStatus: FaceStatus) => void;
}

/**
 * 开始变成老婆
 */
export async function startBecomeWaifu(
  options: BecomeWaifuOptions
): Promise<BecomeWaifu> {
  const {
    videoMediaTrack,
    modelSource,
    frameRequestRate = 30,
    onFaceStatusUpdated,
  } = options;

  const becomeWaifu = new BecomeWaifu({
    videoMediaTrack,
    modelSource,
    drawGuide: true,
  });

  if (onFaceStatusUpdated) {
    becomeWaifu.on('updateFaceStatus', onFaceStatusUpdated);
  }

  becomeWaifu.start(frameRequestRate);

  return becomeWaifu;
}
