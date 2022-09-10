function injectedFunction(extensionId) {
  if(!window.becomeWaifu) {
    window.becomeWaifu = true;
    console.log('开始注入脚本');
    var a = document.createElement('script');
    a.setAttribute('src', `chrome-extension://${extensionId}/vendor/env.js`);
    a.setAttribute('data-become-waifu', "1");
    a.setAttribute('data-runtime-id', `${extensionId}`);
    console.log(`chrome-extension://${extensionId}/vendor/env.js`)
    document.body.appendChild(a);
    var b = document.createElement('script');
    b.setAttribute('src', `chrome-extension://${extensionId}/lib/become-waifu.js`);
    document.body.appendChild(b);
  } else {
    console.log('不能重复注入');
  }
}

chrome.action.onClicked.addListener(function (tab) {
  if(!tab.id) {
    console.log('No tab id, 跳过');
    return;
  }

  console.log('开始注入脚本');
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    world: 'MAIN',
    func: injectedFunction,
    args: [chrome.runtime.id]
  });
});
