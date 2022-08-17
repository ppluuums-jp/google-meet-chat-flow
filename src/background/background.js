function sendMsgToCS(checked, once) {
  const msgObj = { type: "toggle", checked: checked };
  if (once !== undefined) msgObj.once = once;
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.sendMessage(tab.id, msgObj, function (res) {});
    });
  });
}

function updateState(cb) {
  chrome.storage.sync.get({ checked: false }, cb);
}
updateState(function (item) {
  sendMsgToCS(item.checked);
});

chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === "toggle") {
    sendMsgToCS(request.checked, true);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    updateState(function (item) {
      sendMsgToCS(item.checked);
    });
  }
});
