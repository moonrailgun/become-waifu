chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
  console.log('开始注入脚本')
	chrome.tabs.executeScript(tab.id, {
		file: './lib/become-waifu.js'
	});
});
