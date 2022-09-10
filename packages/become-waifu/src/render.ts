import { BecomeWaifu, BecomeWaifuOptions, FaceStatus } from './BecomeWaifu';

export interface StartBecomeWaifuOptions extends BecomeWaifuOptions {
  frameRequestRate?: number;
  onFaceStatusUpdated?: (faceStatus: FaceStatus) => void;
}

/**
 * 开始变成老婆
 */
export async function startBecomeWaifu(
  options: StartBecomeWaifuOptions
): Promise<BecomeWaifu> {
  const { frameRequestRate = 30, onFaceStatusUpdated } = options;

  const becomeWaifu = new BecomeWaifu(options);

  if (onFaceStatusUpdated) {
    becomeWaifu.on('updateFaceStatus', onFaceStatusUpdated);
  }

  becomeWaifu.start(frameRequestRate);

  return becomeWaifu;
}
