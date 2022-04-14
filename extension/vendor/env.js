const scriptEl = document.querySelector('[data-become-waifu]');

if(scriptEl) {
  const runtimeId = scriptEl.getAttribute('data-runtime-id');
  window.live2dModelUrl = `chrome-extension://${runtimeId}/lib/models/diana/Diana1.0.model3.json`;
  // window.live2dModelUrl = `chrome-extension://${runtimeId}/lib/models/hiyori/hiyori_pro_t10.model3.json`;
  window.facemeshVendorUrl = `chrome-extension://${runtimeId}/vendor/face_mesh`;
  console.log('[become-waifu] 初始化参数完毕');
}
