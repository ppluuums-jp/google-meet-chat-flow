("use strict");
//Initialize some variables
let tabId;
let meetURL = "https://meet.google.com/";
let numberOfMessagePrevious = 0;
let countBlockPrevious = 0;
let messageExecuteCount = 0;
let iTmp = 0;
let jTmp = 0;
let count = 0;
let switchFlag;
let firstFireFlag = true;
let firstFireAfterFlag = true;
let swch = document.getElementById("switch");
let error = document.getElementById("error");
//switchオンにしたら後ろでも動くようにstorage使ってやる
//エラー処理
//テスト
//storeに向けた準備
//urlとかでもちゃんとおしりまで行くように修正
//リファクタリング(命名規則統一,関数整理、ファイル分割)

//Get a current tab's id
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  tabId = tabs[0].id;
  if (tabs[0].url.indexOf(meetURL)) {
    setErrorMessage("Click on the meet tab.");
    switchError(true);
  } else {
    // chrome.storage.local.set({ checkedFlag: true }, function () {});
    error.innerHTML = "";
    switchError(false);
  }
});

//Set an error message properly
function setErrorMessage(text) {
  let error_p = document.createElement("p");
  error_p.className = "text-danger";
  error_p.innerHTML = text;
  error.appendChild(error_p);
}

//An error handler
function switchError(display) {
  if (display) {
    error.classList.remove("hidden");
    swch.setAttribute("disabled", "disabled");
    swch.classList.add("swch-secondary");
  } else {
    error.classList.add("hidden");
    swch.removeAttribute("disabled");
    swch.classList.add("swch-success");
  }
}

chrome.storage.local.get("checkedFlag", async function (result) {
  switchFlag = result.checkedFlag;
  console.log(switchFlag);
});

//Execute when the switch gets on
document.querySelector("#switch").addEventListener("change", async () => {
  await main();
  //Execute every 3 seconds
  let timerId = setInterval(async () => {
    await main();
    // if (true) {
    //   document.querySelector("#switch").checked = true;
    //   console.log("passed");
    //   console.log(document.querySelector("#switch").checked);
    // }
    let flag = document.querySelector("#switch").checked;
    if (flag == false) {
      clearInterval(timerId);
    }
  }, 1000);
});

//トグルを閉じた後もtrueにしようとしてたけど、別のフラグ用意すればいける気がしてきた
async function main() {
  const count_block = await returnNumberOfBlocks(tabId);
  const numberOfMessage_object = await returnNumberOfMessages(tabId);
  const numberOfMessage = numberOfMessage_object.result;
  console.log("２回目通ったで");

  if (firstFireFlag) {
    console.log("It's first fire, so just do nothing!");
    countBlockPrevious_object = await returnNumberOfBlocks(tabId);
    countBlockPrevious = countBlockPrevious_object.result;
    firstFireFlag = false;
    numberOfMessagePrevious = numberOfMessage;
    return;
  } else if (numberOfMessagePrevious <= numberOfMessage) {
    //Execute
    //see if there are diffs of number of blocks
    if (countBlockPrevious == count_block.result) {
      await getDiffsNoBlockChanged(tabId); //ブロック数が変わらないとき、つまり前回と同じ人がコメントした時
      console.log("getDiffsNoBlockChangedが走ったで");
      if(firstFireAfterFlag && numberOfMessagePrevious + 1 == numberOfMessage){
        await getFirstMessageAfterFiredNoBlockChanged(
          count_block,
          numberOfMessage,
          firstFireAfterFlag
        );
        console.log("getFirstMessageAfterFiredNoBlockChangedが走ったで");
        firstFireAfterFlag = false;
      }
    } else if (
      firstFireAfterFlag &&
      countBlockPrevious + 1 == count_block.result
    ) {
      await getFirstMessageAfterFiredBlockChanged(
        count_block,
        tabId,
        numberOfMessage
      );
      console.log("getFirstMessageAfterFiredBlockChangedが走ったで");
      firstFireAfterFlag = false;
    } else {
      await getDiffsBlockChanged(count_block, tabId); //ブロック数が変わったとき、つまり前回とは違う人がコメントした時、だからこれも実際はdiffsなんだよな
      console.log("getDiffsBlockChangedが走ったで");
    }
    numberOfMessagePrevious = numberOfMessage;
  }
}

//Get a block count that contains names and times, messages
function getNumberOfBlocks() {
  return document.getElementsByClassName("GDhqjd").length;
}

async function returnNumberOfBlocks(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      { target: { tabId: tabId }, func: getNumberOfBlocks },
      (results) => {
        if (results[0] === null) {
          reject(new Error("Failed to parse meet."));
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

//Get a number of messages
function getNumberOfMessages() {
  return document.getElementsByClassName("oIy2qc").length;
}

async function returnNumberOfMessages(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      { target: { tabId: tabId }, func: getNumberOfMessages },
      (results) => {
        if (results[0] === null) {
          reject(new Error("Failed to parse meet."));
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

//Get message counts which are included in each the blocks
function getMessageCount(i) {
  if (i + 1 == 1) {
    var content_content_length = document.querySelector(
      "#ow3 > div.T4LgNb > div > div:nth-child(10) > div.crqnQb > div.R3Gmyc.qwU8Me > div.WUFI9b > div.hWX4r > div > div.z38b6 > div > div.Zmm6We"
    ).childElementCount;
  } else {
    var content_content_length = document.querySelector(
      "#ow3 > div.T4LgNb > div > div:nth-child(10) > div.crqnQb > div.R3Gmyc.qwU8Me > div.WUFI9b > div.hWX4r > div > div.z38b6 > div:nth-child(" +
        String(i + 1) +
        ") > div.Zmm6We"
    ).childElementCount;
  }
  return content_content_length;
}

async function returnMessageCount(tabId, i) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      { target: { tabId: tabId }, func: getMessageCount, args: [i] },
      (results) => {
        if (results[0] === null) {
          reject(new Error("Failed to parse meet."));
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

//Get Messages from "Google Meet Chat"
function parseMessage(i) {
  return document.getElementsByClassName("oIy2qc")[i].textContent;
}

async function getMessage(tabId, i) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      { target: { tabId: tabId }, func: parseMessage, args: [i] },
      (results) => {
        if (results[0] === null) {
          reject(new Error("Failed to parse meet."));
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

//Insert messages
async function insertMessage(message, count) {
  var randomSize = Math.floor(Math.random() * 30) + 16; //16 to 45
  var randomHight = Math.round(
    Math.random() * document.documentElement.clientHeight
  );
  var p = document.createElement("p");
  p.className = "messages";
  p.id = "message" + count;
  p.style.color = "white";
  p.style.fontSize = randomSize + "px";
  p.style.fontFamily = "sans-serif";
  p.style.fontWeight = "bold";
  p.style.position = "fixed";
  p.style.whiteSpace = "nowrap";
  p.style.zIndex = "1001";
  p.style.left = document.documentElement.clientWidth + "px";
  p.style.top = randomHight + "px";
  p.appendChild(document.createTextNode(message));
  document.body.appendChild(p);
  console.log("done with insertion");
}

async function executeInsertion(tabId, message, count) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      { target: { tabId: tabId }, func: insertMessage, args: [message, count] },
      (results) => {
        if (results[0] === null) {
          reject(new Error("Failed to insert messages."));
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

//Animate messages
function animateMessages(count) {
  var p = document.querySelector("#message" + count);
  var randomSpeed = Math.floor(Math.random() * 10001) + 10000; //10000 to 20000
  p.animate(
    [
      // keyframes
      { transform: "translateX(100vw)" },
      { transform: "translateX(-150vw)" }, //urlとかもちゃんとおしりまで流れるようにしないといけない
    ],
    {
      // timing options
      duration: randomSpeed,
      iterations: Infinity,
    }
  );
  setTimeout(function () {
    p.parentNode.removeChild(p);
  }, randomSpeed);
  console.log("done with animation");
}

async function executeAnimation(tabId, count) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      { target: { tabId: tabId }, func: animateMessages, args: [count] },
      (results) => {
        if (results[0] === null) {
          reject(new Error("Failed to animate messages."));
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

//Execute when gets first message after the firing
async function getFirstMessageAfterFiredBlockChanged(
  count_block,
  tabId,
  numberOfMessage
) {
  //Count messages to get start point
  for (let i = count_block.result; i < count_block.result + 1; i++) {
    console.log(i - 1);
    console.log(count_block.result);
    // const count_message = await returnMessageCount(tabId, i - 1);
    // console.log(count_message.result);

    //Get messages for each name_times
    for (let j = 0; j < 1; j++) {
      messageExecuteCount = numberOfMessage - 1; //ここをすべてのメッセージ数-1にしてあげればいいはず
      console.log(messageExecuteCount);
      getMessageForEachNameAndTime(j);
    }
    iTmp = count_block.result;
  }
  countBlockPrevious = count_block.result;
}

async function getFirstMessageAfterFiredNoBlockChanged(
  count_block,
  numberOfMessage
) {
  // const count_message = 1;

  for (let j = jTmp; j < 1; j++) {
    messageExecuteCount = numberOfMessage - 1;
    getMessageForEachNameAndTime(j);
  }
}

//Execute when there are diffs of blocks
async function getDiffsBlockChanged(count_block, tabId) {
  //Count messages to get start point
  for (let i = iTmp; i < count_block.result; i++) {
    const count_message = await returnMessageCount(tabId, i);
    console.log(iTmp);

    //Get messages for each name_times
    for (let j = 0; j < count_message.result; j++) {
      getMessageForEachNameAndTime(j);
    }
    iTmp = i + 1;
  }
  countBlockPrevious = count_block.result;
}

async function getDiffsNoBlockChanged(tabId) {
  const count_message = await returnMessageCount(tabId, iTmp - 1);
  console.log(count_message.result);

  for (let j = jTmp; j < count_message.result; j++) {
    getMessageForEachNameAndTime(j);
  }
}

async function getMessageForEachNameAndTime(j) {
  const get_message = await getMessage(tabId, messageExecuteCount);
  const message = get_message.result;
  await executeInsertion(tabId, message, count);
  await executeAnimation(tabId, count);
  console.log(message);
  messageExecuteCount++;
  count++;
  jTmp = j + 1;
}
