("use strict");
//Initialize some variables
let tabId;
// let meetURL = "https://meet.google.com/";
let numberOfMessagePrevious = 0;
let countBlockPrevious = 0;
let messageExecuteCount = 0;
let iTmp = 0;
let jTmp = 0;
let count = 0;
let switchFlag;
let firstFireFlag = true;
let firstFireAfterFlag = true;
// let swch = document.getElementById("switch");
// let error = document.getElementById("error");
// //switchオンにしたら後ろでも動くようにstorage使ってやる
// //テスト
// //storeに向けた準備
// //リファクタリング(命名規則統一,関数整理、ファイル分割)
// //document.addEventListener('DOMContentLoaded'ベースにできるか？

// //Get a current tab's id
// chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
//   tabId = tabs[0].id;
//   if (tabs[0].url.indexOf(meetURL)) {
//     setErrorMessage("Click on the meet tab.");
//     switchError(true);
//   } else {
//     // chrome.storage.local.set({ checkedFlag: true }, function () {});
//     error.innerHTML = "";
//     switchError(false);
//   }
// });

// //Set an error message properly
// function setErrorMessage(text) {
//   let error_p = document.createElement("p");
//   error_p.className = "text-danger";
//   error_p.innerHTML = text;
//   error.appendChild(error_p);
// }

// //An error handler
// function switchError(display) {
//   if (display) {
//     error.classList.remove("hidden");
//     swch.setAttribute("disabled", "disabled");
//     swch.classList.add("swch-secondary");
//   } else {
//     error.classList.add("hidden");
//     swch.removeAttribute("disabled");
//     swch.classList.add("swch-success");
//   }
// }

// // chrome.storage.local.get("checkedFlag", async function (result) {
// //   switchFlag = result.checkedFlag;
// //   console.log(switchFlag);
// // });

// // document.addEventListener("DOMContentLoaded", async () => {
// //   swch.checked = true;
// //   console.log("走ったで");
// // });

// // chrome.runtime.getBackgroundPage().window.alert("background.js");

//falseからtrueは機能するんだけど、trueからfalseがうまく機能していない
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(message.checked); //checked: false type: "toggle"が入っとる
  console.log(sender.id); //senderにはsender.idが入っとる
  tabId = sender.id;
  if (message.checked == true) {
    await main();

    //Execute every 3 seconds
    let timerId = setInterval(async () => {
      await main();
      if (message.checked == false) {
        clearInterval(timerId);
      }
    }, 1000);
  }
  return true;
});

// //Execute when the switch gets on
// swch.addEventListener("change", async () => {
//   await main();
//   //Execute every 3 seconds
//   let timerId = setInterval(async () => {
//     await main();
//     // if (swch.checked == true) {
//     //   swch.checked = true;
//     //   console.log("passed");
//     //   console.log(swch.checked);
//     // }
//     let flag = swch.checked;
//     if (flag == false) {
//       clearInterval(timerId);
//     }
//   }, 1000);
// });

async function main() {
  const count_block = getNumberOfBlocks();
  const numberOfMessage = getNumberOfMessages();
  console.log("２回目通ったで");
  console.log(count_block);
  console.log(numberOfMessage);
  if (firstFireFlag) {
    console.log("It's first fire, so just do nothing!");
    countBlockPrevious = getNumberOfBlocks;
    firstFireFlag = false;
    numberOfMessagePrevious = numberOfMessage;
    return;
  } else if (numberOfMessagePrevious <= numberOfMessage) {
    //Execute
    //see if there are diffs of number of blocks
    console.log("hoge");
    if (countBlockPrevious == count_block) {
      await getDiffsNoBlockChanged(tabId); //ブロック数が変わらないとき、つまり前回と同じ人がコメントした時
      console.log("getDiffsNoBlockChangedが走ったで");
      if (
        firstFireAfterFlag &&
        numberOfMessagePrevious + 1 == numberOfMessage
      ) {
        await getFirstMessageAfterFiredNoBlockChanged(
          count_block,
          numberOfMessage,
          firstFireAfterFlag
        );
        console.log("getFirstMessageAfterFiredNoBlockChangedが走ったで");
        firstFireAfterFlag = false;
      }
    } else if (firstFireAfterFlag && countBlockPrevious + 1 == count_block) {
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

// async function returnNumberOfBlocks(tabId) {
//   return new Promise((resolve, reject) => {
//     chrome.scripting.executeScript(
//       { target: { tabId: tabId }, func: getNumberOfBlocks },
//       (results) => {
//         if (results[0] === null) {
//           reject(new Error("Failed to parse meet."));
//         } else {
//           resolve(results[0]);
//         }
//       }
//     );
//   });
// }

//Get a number of messages
function getNumberOfMessages() {
  return document.getElementsByClassName("oIy2qc").length;
}

// async function returnNumberOfMessages(tabId) {
//   return new Promise((resolve, reject) => {
//     chrome.scripting.executeScript(
//       { target: { tabId: tabId }, func: getNumberOfMessages },
//       (results) => {
//         if (results[0] === null) {
//           reject(new Error("Failed to parse meet."));
//         } else {
//           resolve(results[0]);
//         }
//       }
//     );
//   });
// }

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

// async function returnMessageCount(tabId, i) {
//   return new Promise((resolve, reject) => {
//     chrome.scripting.executeScript(
//       { target: { tabId: tabId }, func: getMessageCount, args: [i] },
//       (results) => {
//         if (results[0] === null) {
//           reject(new Error("Failed to parse meet."));
//         } else {
//           resolve(results[0]);
//         }
//       }
//     );
//   });
// }

//Get Messages from "Google Meet Chat"
function parseMessage(i) {
  return document.getElementsByClassName("oIy2qc")[i].textContent;
}

// async function getMessage(tabId, i) {
//   return new Promise((resolve, reject) => {
//     chrome.scripting.executeScript(
//       { target: { tabId: tabId }, func: parseMessage, args: [i] },
//       (results) => {
//         if (results[0] === null) {
//           reject(new Error("Failed to parse meet."));
//         } else {
//           resolve(results[0]);
//         }
//       }
//     );
//   });
// }

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

// async function executeInsertion(tabId, message, count) {
//   return new Promise((resolve, reject) => {
//     chrome.scripting.executeScript(
//       { target: { tabId: tabId }, func: insertMessage, args: [message, count] },
//       (results) => {
//         if (results[0] === null) {
//           reject(new Error("Failed to insert messages."));
//         } else {
//           resolve(results[0]);
//         }
//       }
//     );
//   });
// }

//Animate messages
async function animateMessages(count) {
  var p = document.querySelector("#message" + count);
  var randomSpeed = Math.floor(Math.random() * 10001) + 20000; //20000 to 30000
  p.animate(
    [
      // keyframes
      { transform: "translateX(100vw)" },
      { transform: "translateX(-300vw)" },
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

// async function executeAnimation(tabId, count) {
//   return new Promise((resolve, reject) => {
//     chrome.scripting.executeScript(
//       { target: { tabId: tabId }, func: animateMessages, args: [count] },
//       (results) => {
//         if (results[0] === null) {
//           reject(new Error("Failed to animate messages."));
//         } else {
//           resolve(results[0]);
//         }
//       }
//     );
//   });
// }

//Execute when gets first message after the firing
async function getFirstMessageAfterFiredBlockChanged(
  count_block,
  tabId,
  numberOfMessage
) {
  //Count messages to get start point
  for (let i = count_block; i < count_block + 1; i++) {
    console.log(i - 1);
    console.log(count_block);
    // const count_message = await returnMessageCount(tabId, i - 1);
    // console.log(count_message.result);

    //Get messages for each name_times
    for (let j = 0; j < 1; j++) {
      messageExecuteCount = numberOfMessage - 1; //ここをすべてのメッセージ数-1にしてあげればいいはず
      console.log(messageExecuteCount);
      getMessageForEachNameAndTime(j);
    }
    iTmp = count_block;
  }
  countBlockPrevious = count_block;
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
  for (let i = iTmp; i < count_block; i++) {
    const count_message = getMessageCount(i);
    console.log(iTmp);

    //Get messages for each name_times
    for (let j = 0; j < count_message; j++) {
      getMessageForEachNameAndTime(j);
    }
    iTmp = i + 1;
  }
  countBlockPrevious = count_block;
}

async function getDiffsNoBlockChanged(tabId) {
  const count_message = getMessageCount(iTmp - 1);
  console.log(count_message);

  for (let j = jTmp; j < count_message; j++) {
    getMessageForEachNameAndTime(j);
  }
}

async function getMessageForEachNameAndTime(j) {
  const message = parseMessage(messageExecuteCount);
  await insertMessage(message, count);
  await animateMessages(count);
  console.log(message);
  messageExecuteCount++;
  count++;
  jTmp = j + 1;
}
