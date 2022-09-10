import loadScript from 'load-script';
import type { BecomeWaifuOptions } from './render';

const loadScriptP = (url: string, opts: Parameters<typeof loadScript>[1]) =>
  new Promise((resolve) => {
    loadScript(url, opts, resolve);
  });

/**
 * 变成waifu
 */
export async function becomeWaifu(options: BecomeWaifuOptions) {
  /**
   * 开始创建转换
   */

  console.log('[become-waifu] 开始加载依赖');
  await Promise.all([
    loadScriptP(
      'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
      {}
    ),
    loadScriptP(
      'https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js',
      {}
    ),
    loadScriptP(
      'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js',
      {}
    ),
  ]);

  console.log('[become-waifu] 创建live2d模型');
  const { startBecomeWaifu } = await import('./render');

  return startBecomeWaifu(options);
}
