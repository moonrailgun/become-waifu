chrome.browserAction.onClicked.addListener(function (tab) {
  if(!tab.id) {
    console.log('No tab id, 跳过');
    return;
  }

  console.log('开始注入脚本');
  chrome.tabs.executeScript(tab.id, {
    // 通过这种方式提权
    code: `
    if(!window.becomeWaifu) {
      window.becomeWaifu = true;
      console.log('开始注入脚本');
      var a = document.createElement('script');
      a.setAttribute('src', "chrome-extension://${chrome.runtime.id}/vendor/env.js");
      a.setAttribute('data-become-waifu', "1");
      a.setAttribute('data-runtime-id', "${chrome.runtime.id}");
      document.body.appendChild(a);
      var b = document.createElement('script');
      b.setAttribute('src', "chrome-extension://${chrome.runtime.id}/lib/become-waifu.js");
      document.body.appendChild(b);
    } else {
      console.log('不能重复注入');
    }
    `,
  });
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // console.log(details);
    if (details.url.endsWith('face_mesh_solution_packed_assets.data')) {
      // console.log('redirect')
      return {
        redirectUrl:
          'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh_solution_packed_assets.data',
      };
    }
  },
  {
    urls: ['<all_urls>'],
    types: [
      'main_frame',
      'sub_frame',
      'stylesheet',
      'script',
      'image',
      'object',
      'xmlhttprequest',
      'other',
    ],
  },
  ['blocking']
);
