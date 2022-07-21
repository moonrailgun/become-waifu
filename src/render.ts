import { Application } from 'pixi.js';
import { Live2DModel, ModelSettings } from 'pixi-live2d-display';
import * as Kalidokit from 'kalidokit';
import {
  FaceMesh,
  FACEMESH_TESSELATION,
  NormalizedLandmarkList,
} from '@mediapipe/face_mesh';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import _snakeCase from 'lodash/snakeCase';
import _once from 'lodash/once';
import { bindUserMedia } from './bindUserMedia';
import { renderController } from './renderController';
import { BecomeWaifu, FaceStatus } from './BecomeWaifu';
import './render.less';

const rootEl = document.createElement('div');
rootEl.className = 'become-waifu';
const debugPreviewEl = document.createElement('div');
debugPreviewEl.className = 'preview';
const debugPreviewInputEl = document.createElement('video');
debugPreviewInputEl.autoplay = true;
const debugPreviewGuidesEl = document.createElement('canvas');
debugPreviewGuidesEl.className = 'guides';
const live2dContainerEl = document.createElement('div');
live2dContainerEl.className = 'live';
const live2dPreviewEl = document.createElement('canvas');

// Kalidokit provides a simple easing function
// (linear interpolation) used for animation smoothness
// you can use a more advanced easing function if you want
const {
  Face,
  Vector: { lerp },
  Utils: { clamp },
} = Kalidokit;

// Url to Live2D
// const modelUrl = '/models/hiyori/hiyori_pro_t10.model3.json';
const modelUrl =
  (window as any).live2dModelUrl || '/models/diana/Diana1.0.model3.json';

let currentModel;
let facemesh: FaceMesh;

export async function fullBecomeWaifu() {
  initDom();

  // create pixi application
  const app = new Application({
    view: live2dPreviewEl,
    autoStart: true,
    backgroundAlpha: 0,
    backgroundColor: 0xffffff,
  });

  // load live2d model
  currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
  currentModel.scale.set(0.2);
  currentModel.interactive = true;
  currentModel.anchor.set(0.5, 0.5);
  currentModel.position.set(app.view.width * 0.5, app.view.height * 0.8);

  // Add events to drag model
  currentModel.on('pointerdown', (e) => {
    currentModel.offsetX = e.data.global.x - currentModel.position.x;
    currentModel.offsetY = e.data.global.y - currentModel.position.y;
    currentModel.dragging = true;
  });
  currentModel.on('pointerup', (e) => {
    currentModel.dragging = false;
  });
  currentModel.on('pointermove', (e) => {
    if (currentModel.dragging) {
      currentModel.position.set(
        e.data.global.x - currentModel.offsetX,
        e.data.global.y - currentModel.offsetY
      );
    }
  });

  // Add mousewheel events to scale model
  live2dPreviewEl.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault();
    currentModel.scale.set(
      clamp(currentModel.scale.x + e.deltaY * -0.001, -0.5, 10)
    );
  });

  // add live2d model to stage
  app.stage.addChild(currentModel);

  initFacemesh();

  startCamera();

  bindUserMedia(live2dPreviewEl);
}

/**
 * 标记已经正常开始工作
 */
const markRigActived = _once(() => {
  live2dContainerEl.classList.add('work');
});

/**
 * 初始化dom节点
 *
 * 只能被调用一次
 */
const initDom = _once(() => {
  debugPreviewEl.appendChild(debugPreviewInputEl);
  debugPreviewEl.appendChild(debugPreviewGuidesEl);
  live2dContainerEl.appendChild(live2dPreviewEl);
  rootEl.appendChild(debugPreviewEl);
  rootEl.appendChild(live2dContainerEl);

  const controllerEl = document.createElement('div');
  controllerEl.className = 'controller';
  live2dContainerEl.prepend(controllerEl);
  renderController(rootEl, controllerEl);

  document.body.append(rootEl);
});

function initFacemesh() {
  // create media pipe facemesh instance
  facemesh = new FaceMesh({
    locateFile: (file) => {
      const vendorUrl =
        (window as any).facemeshVendorUrl ||
        'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh';
      const fileUrl = `${vendorUrl}/${file}`;
      return `${fileUrl}`;
    },
  });

  // set facemesh config
  facemesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  // pass facemesh callback function
  facemesh.onResults((results) => {
    markRigActived();

    drawResults(results.multiFaceLandmarks[0]); // 绘制结果
    animateLive2DModel(results.multiFaceLandmarks[0]); // 面部绑定
  });
}

// draw connectors and landmarks on output canvas
const drawResults = (points: NormalizedLandmarkList) => {
  if (!debugPreviewGuidesEl || !debugPreviewInputEl || !points) {
    return;
  }
  debugPreviewGuidesEl.width = debugPreviewInputEl.videoWidth;
  debugPreviewGuidesEl.height = debugPreviewInputEl.videoHeight;
  let canvasCtx = debugPreviewGuidesEl.getContext('2d');
  canvasCtx.save();
  canvasCtx.clearRect(
    0,
    0,
    debugPreviewGuidesEl.width,
    debugPreviewGuidesEl.height
  );
  // Use `Mediapipe` drawing functions
  drawConnectors(canvasCtx, points, FACEMESH_TESSELATION, {
    color: '#C0C0C070',
    lineWidth: 1,
  });
  if (points && points.length === 478) {
    //draw pupils
    drawLandmarks(canvasCtx, [points[468], points[468 + 5]], {
      color: '#ffe603',
      lineWidth: 2,
    });
  }
};

const animateLive2DModel = (points: NormalizedLandmarkList) => {
  if (!currentModel || !points) {
    return;
  }

  if (points) {
    // use kalidokit face solver
    const riggedFace = Face.solve(points, {
      runtime: 'mediapipe',
      video: debugPreviewInputEl,
    });
    rigFace(riggedFace, 0.5);
  }
};

// update live2d model internal state
const rigFace = (result: Kalidokit.TFace, lerpAmount = 0.7) => {
  if (!currentModel || !result) {
    return;
  }
  const coreModel = currentModel.internalModel.coreModel;

  currentModel.internalModel.motionManager.update = (...args) => {
    // disable default blink animation
    currentModel.internalModel.eyeBlink = undefined;

    function switchToName2(name: string): string {
      return _snakeCase(name).toUpperCase();
    }

    function bindParam(name: string, fn: (val: number) => number) {
      // 方案一
      coreModel.setParameterValueById(
        name,
        fn(coreModel.getParameterValueById(name))
      );
      // 方案二
      const name2 = switchToName2(name);
      coreModel.setParameterValueById(
        name2,
        fn(coreModel.getParameterValueById(name2))
      );
    }

    bindParam('ParamEyeBallX', (num) => lerp(result.pupil.x, num, lerpAmount));
    bindParam('ParamEyeBallY', (num) => lerp(result.pupil.y, num, lerpAmount));

    // X and Y axis rotations are swapped for Live2D parameters
    // because it is a 2D system and KalidoKit is a 3D system
    bindParam('ParamAngleX', (num) =>
      lerp(result.head.degrees.y, num, lerpAmount)
    );
    bindParam('ParamAngleY', (num) =>
      lerp(result.head.degrees.x, num, lerpAmount)
    );
    bindParam('ParamAngleZ', (num) =>
      lerp(result.head.degrees.z, num, lerpAmount)
    );

    // update body params for models without head/body param sync
    const dampener = 0.3;
    bindParam('ParamBodyAngleX', (num) =>
      lerp(result.head.degrees.y * dampener, num, lerpAmount)
    );
    bindParam('ParamBodyAngleY', (num) =>
      lerp(result.head.degrees.x * dampener, num, lerpAmount)
    );
    bindParam('ParamBodyAngleZ', (num) =>
      lerp(result.head.degrees.z * dampener, num, lerpAmount)
    );

    // Simple example without winking.
    // Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
    const stabilizedEyes = Kalidokit.Face.stabilizeBlink(
      {
        l: lerp(
          result.eye.l,
          coreModel.getParameterValueById('ParamEyeLOpen'),
          0.7
        ),
        r: lerp(
          result.eye.r,
          coreModel.getParameterValueById('ParamEyeROpen'),
          0.7
        ),
      },
      result.head.y
    );
    // eye blink
    coreModel.setParameterValueById('ParamEyeLOpen', stabilizedEyes.l);
    coreModel.setParameterValueById('ParamEyeROpen', stabilizedEyes.r);

    const stabilizedEyes2 = Kalidokit.Face.stabilizeBlink(
      {
        l: lerp(
          result.eye.l,
          coreModel.getParameterValueById(switchToName2('ParamEyeLOpen')),
          0.7
        ),
        r: lerp(
          result.eye.r,
          coreModel.getParameterValueById(switchToName2('ParamEyeROpen')),
          0.7
        ),
      },
      result.head.y
    );
    // eye blink
    coreModel.setParameterValueById(
      switchToName2('ParamEyeLOpen'),
      stabilizedEyes2.l
    );
    coreModel.setParameterValueById(
      switchToName2('ParamEyeROpen'),
      stabilizedEyes2.r
    );

    // mouth
    bindParam('ParamMouthOpenY', (num) => lerp(result.mouth.y, num, 0.3));

    // Adding 0.3 to ParamMouthForm to make default more of a "smile"
    bindParam('ParamMouthForm', (num) => 0.3 + lerp(result.mouth.x, num, 0.3));
  };
};

// start camera using mediapipe camera utils
const startCamera = () => {
  const camera = new Camera(debugPreviewInputEl, {
    onFrame: async () => {
      await facemesh.send({ image: debugPreviewInputEl });
    },
    width: 640,
    height: 480,
  });

  camera.start();
};

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
): Promise<MediaStreamTrack> {
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

  const track = becomeWaifu.start(frameRequestRate);

  return track;
}
