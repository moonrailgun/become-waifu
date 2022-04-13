import '../vendor/live2d.min.js';
import '../vendor/live2dcubismcore.js';
import loadScript from 'load-script';
import _once from 'lodash/once';

if (!(window as any).PIXI) {
  loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js',
    { async: true },
    () => {
      create();
    }
  );
}

/**
 * 开始创建转换
 */
async function create() {
  console.log('创建live2d模型');
  import('./render').then((m) => m.startBecomeWaifu());
}
