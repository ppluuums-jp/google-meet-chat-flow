function init() {
  var fun = document.getElementById("fun");
  var toggle = document.getElementById("toggle");

  // initial state
  chrome.storage.sync.get({ checked: false }, function (item) {
    fun.checked = item.checked;
    if (fun.checked) {
      // soundListener(true);
    }
  });

  // sends a message to the background script and saves option
  toggle.addEventListener(
    "click",
    function () {
      "hasittayo";
      fun.checked = !fun.checked;
      chrome.storage.sync.set({ checked: fun.checked });
      chrome.runtime.sendMessage({ type: "toggle", checked: fun.checked });
    },
    false
  );
}

document.addEventListener("DOMContentLoaded", init, false);
