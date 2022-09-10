import type { ModelSettings } from 'pixi-live2d-display';
import _snakeCase from 'lodash/snakeCase';
import _once from 'lodash/once';
import { BecomeWaifu, FaceStatus } from './BecomeWaifu';
import './render.less';

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
