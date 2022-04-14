# become-waifu
变成自己的二次元老婆

## 介绍 Intro

基于面部捕捉和live2d的虚拟偶像，如果没有waifu的话就自己变成waifu吧！

无需安装任何软件就能在网页串流服务中使用！

## 用法 Usage

- 打开任意网页端视频会话软件
- 点击插件图标，注入相关代码
- 右下角显示live2d预览窗口，用于调整到合适位置
- 打开网页端视频会话的开启视频(如已开启需要重新获取)

## 本地编译

```bash
pnpm install
pnpm build
```

## 已知问题 Known Issue

- 在部分视频会议平台处于失活状态是会出现获取视频流异常的问题
  > 请出现这种情况需要持续保持窗口激活

## 特别声明 Important Clause

- 本项目内所使用的live2d均为演示使用，不包含任何版权

## 特别感谢 Special Thanks

感谢以下已经成熟的库的存在才使得本项目能够有实现的基础

- [@mediapipe/face_mesh](https://google.github.io/mediapipe/solutions/face_mesh) google推出的面部识别解决方案
- [kalidokit](https://github.com/yeemachine/kalidokit) 面部手势追踪路径计算库
- [pixi](https://pixijs.com/) 平面渲染库
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) pixi显示live2d模型
- [live2dcubismcore](https://www.live2d.com/en/download/cubism-sdk/) live2d立体化渲染核心
