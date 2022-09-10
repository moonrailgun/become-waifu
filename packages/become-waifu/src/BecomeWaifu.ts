import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import {
  FaceMesh,
  FACEMESH_TESSELATION,
  NormalizedLandmarkList,
} from '@mediapipe/face_mesh';
import * as Kalidokit from 'kalidokit';
import {
  Cubism2InternalModel,
  Cubism4InternalModel,
  Live2DFactory,
  Live2DModel,
  ModelSettings,
} from 'pixi-live2d-display';
import { FrameManager, trackToStream } from './utils';
import { EventEmitter } from 'eventemitter-strict';
import { snakeCase } from 'lodash-es';

const {
  Face,
  Vector: { lerp },
} = Kalidokit;

export type FaceStatus = 'init' | 'health' | 'lose';

interface BecomeWaifuEvents {
  updateFaceStatus: (faceStatus: FaceStatus) => void;
}

export interface BecomeWaifuOptions {
  videoMediaTrack: MediaStreamTrack;
  modelSource: string | object | ModelSettings | File[];
  /**
   * 模型尺寸缩放
   */
  modelScale?: number;
  /**
   * facemesh 依赖地址
   *
   * @default https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh
   */
  facemeshVendorUrl?: string;
  /**
   * 是否绘制面部网格
   */
  drawGuide?: boolean;
}

export class BecomeWaifu extends EventEmitter<BecomeWaifuEvents> {
  inputVideoEl = document.createElement('video');
  outputCanvasEl = document.createElement('canvas');
  guideCanvasEl = document.createElement('canvas');
  live2dModel: Live2DModel<Cubism2InternalModel | Cubism4InternalModel>;
  faceStatus: FaceStatus = 'init';
  private facemesh: FaceMesh;
  private frameManager: FrameManager;

  constructor(public options: BecomeWaifuOptions) {
    super();

    // create pixi application
    const app = new (window as any).PIXI.Application({
      view: this.outputCanvasEl,
      autoStart: true,
      // backgroundAlpha: 0,
      backgroundColor: 0xffffff,
    });

    // document.body.appendChild(this.guideCanvasEl);
    // document.body.appendChild(this.outputCanvasEl);

    this.inputVideoEl.srcObject = trackToStream(options.videoMediaTrack);
    this.inputVideoEl.autoplay = true;

    this.initLive2dModel().then(() => {
      (this.live2dModel as any).position.set(
        app.view.width * 0.5,
        app.view.height * 0.8
      );
      app.stage.addChild(this.live2dModel as any);

      this.initFacemesh();
    });
  }

  /**
   * 开始
   */
  public start(frameRequestRate = 30) {
    this.frameManager = new FrameManager();
    this.frameManager.start(async () => {
      if (this.facemesh) {
        await this.facemesh.send({ image: this.inputVideoEl });
      }
    });

    return this.getOutputVideoTrack(frameRequestRate);
  }

  /**
   * 停止
   */
  public stop() {
    this.frameManager.stop();
  }

  /**
   * 获取输出的视频流
   */
  public getOutputVideoTrack(frameRequestRate = 30) {
    return this.outputCanvasEl
      .captureStream(frameRequestRate)
      .getVideoTracks()[0];
  }

  private updateFaceStatus(faceStatus: FaceStatus) {
    if (this.faceStatus !== faceStatus) {
      this.faceStatus = faceStatus;
      this.emit('updateFaceStatus', faceStatus);
    }
  }

  private async initLive2dModel() {
    const modelSource = this.options.modelSource;
    if (Array.isArray(modelSource) && modelSource[0].name.endsWith('.zip')) {
      // 是文件来源 且是zip包
      const pixiModel = new Live2DModel<
        Cubism2InternalModel | Cubism4InternalModel
      >();
      await import('./utils/zip');
      await Live2DFactory.setupLive2DModel(pixiModel, modelSource);
      this.live2dModel = pixiModel;
    } else {
      this.live2dModel = (await Live2DModel.from(this.options.modelSource, {
        autoInteract: false,
      })) as Live2DModel<Cubism2InternalModel | Cubism4InternalModel>;
    }

    (this.live2dModel as any).scale.set(this.options.modelScale ?? 0.3);
    (this.live2dModel as any).interactive = true;
    this.live2dModel.anchor.set(0.5, 0.5);
  }

  private initFacemesh() {
    this.facemesh = new FaceMesh({
      locateFile: (file) => {
        const vendorUrl =
          this.options.facemeshVendorUrl ??
          'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh';
        const fileUrl = `${vendorUrl}/${file}`;
        return `${fileUrl}`;
      },
    });
    this.facemesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    // 面部捕捉回调
    this.facemesh.onResults((results) => {
      const faceLandmarks = results.multiFaceLandmarks[0];

      if (!faceLandmarks) {
        this.updateFaceStatus('lose');
      } else {
        this.updateFaceStatus('health');
      }

      this.drawResults(faceLandmarks); // 绘制结果
      this.animateLive2DModel(faceLandmarks); // 面部绑定
    });
  }

  private drawResults(points: NormalizedLandmarkList) {
    if (!this.options.drawGuide) {
      return;
    }

    if (!this.guideCanvasEl || !this.inputVideoEl || !points) {
      return;
    }
    this.guideCanvasEl.width = this.inputVideoEl.videoWidth;
    this.guideCanvasEl.height = this.inputVideoEl.videoHeight;
    const canvasCtx = this.guideCanvasEl.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      this.guideCanvasEl.width,
      this.guideCanvasEl.height
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
  }

  private animateLive2DModel(points: NormalizedLandmarkList) {
    if (!this.live2dModel || !points) {
      return;
    }

    if (points) {
      // use kalidokit face solver
      const riggedFace = Face.solve(points, {
        runtime: 'mediapipe',
        video: this.inputVideoEl,
      });
      this.rigFace(riggedFace, 0.5);
    }
  }

  // update live2d model internal state
  private rigFace(result: Kalidokit.TFace, lerpAmount = 0.7) {
    const live2dModel = this.live2dModel;
    if (!live2dModel || !result) {
      return;
    }

    const coreModel = live2dModel.internalModel.coreModel as any;

    live2dModel.internalModel.motionManager.update = (
      model: object,
      now: number
    ): any => {
      // 禁用默认眨眼动画
      live2dModel.internalModel.eyeBlink = undefined;

      function switchToName2(name: string): string {
        return snakeCase(name).toUpperCase();
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

      bindParam('ParamEyeBallX', (num) =>
        lerp(result.pupil.x, num, lerpAmount)
      );
      bindParam('ParamEyeBallY', (num) =>
        lerp(result.pupil.y, num, lerpAmount)
      );

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
      bindParam(
        'ParamMouthForm',
        (num) => 0.3 + lerp(result.mouth.x, num, 0.3)
      );
    };
  }
}
