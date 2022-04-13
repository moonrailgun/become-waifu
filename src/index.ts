import loadScript from 'load-script';
import { ref, effect } from '@vue/reactivity';

const isPIXILoad = ref(false);
const isLive2dLoad = ref(false);
const isCubismLoad = ref(false);
const isFaceMeshLoad = ref(false);
const isCameraUtilsLoad = ref(false);
const isDrawiingUtilsLoad = ref(false);

if (!(window as any).PIXI) {
  loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js',
    { async: true },
    () => {
      isPIXILoad.value = true;
    }
  );
}

if (
  !(window as any).FaceMesh ||
  !(window as any).Camera ||
  !(window as any).drawConnectors
) {
  loadScript(
    'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js',
    { async: true },
    () => {
      isFaceMeshLoad.value = true;
    }
  );
  loadScript(
    'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
    { async: true },
    () => {
      isCameraUtilsLoad.value = true;
    }
  );
  loadScript(
    'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
    { async: true },
    () => {
      isDrawiingUtilsLoad.value = true;
    }
  );
}

if (!(window as any).Live2D || !(window as any).Live2DCubismCore) {
  loadScript(
    'https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js',
    {
      async: true,
    },
    () => {
      isLive2dLoad.value = true;
    }
  );
  loadScript(
    'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
    { async: true },
    () => {
      isCubismLoad.value = true;
    }
  );
} else {
  isLive2dLoad.value = true;
  isCubismLoad.value = true;
}

async function create() {
  // console.log('创建live2d模型');
  // import('./live2d');
  import('./demo');
}

effect(() => {
  if (
    isPIXILoad.value &&
    isLive2dLoad.value &&
    isCubismLoad.value &&
    isFaceMeshLoad.value &&
    isCameraUtilsLoad.value &&
    isDrawiingUtilsLoad.value
  ) {
    create();
  }
});
