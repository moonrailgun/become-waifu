import '../vendor/pixi.min.js';
import '../vendor/live2d.min.js';
import '../vendor/live2dcubismcore.js';
import { startBecomeWaifu } from './render';
import _once from 'lodash/once';

const create = _once(async () => {
  console.log('创建live2d视图');
  startBecomeWaifu();
});

create();
