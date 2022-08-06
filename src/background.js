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

//これ使われてない気がする
chrome.runtime.onMessage.addListener(function (request) {
  //   if (request.type === "sound") {
  //     var myAudio = new Audio();
  //     myAudio.src = `./sounds/${attachSounds[request.sound]}`;
  //     myAudio.play();
  //   } else
  if (request.type === "toggle") {
    console.log("やっぱり使われているで");
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

// chrome.commands.onCommand.addListener(function (command) {
//   if (command === "toggle-baby-mode") {
//     chrome.runtime.sendMessage({ type: "switch" });
//     updateState(function (item) {
//       sendMsgToCS(!item.checked);
//       chrome.storage.sync.set({ checked: !item.checked });
//     });
//   }
// });
