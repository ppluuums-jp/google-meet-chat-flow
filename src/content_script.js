("use strict");
//Initialize some variables
let tabId,
messageChecked,
numberOfMessagePrevious = 0,
countBlockPrevious = 0,
messageExecuteCount = 0,
iTmp = 0,
jTmp = 0,
count = 0,
switchFlag,
firstFireFlag = true,
firstFireAfterFlag = true
// //storeに向けた準備
// //リファクタリング(命名規則統一,関数整理、ファイル分割)


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  tabId = sender.id;
  messageChecked = message.checked;

  if(message.checked){
    await main();
  }
  //Execute every 3 seconds
  let timerId = setInterval(async () => {
      await main(timerId);
  }, 1000);

  return true;
});

async function main(timerId) {
  const count_block = getNumberOfBlocks();
  const numberOfMessage = getNumberOfMessages();
  if (messageChecked === false) {
    clearInterval(timerId);
  }
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
      await getDiffsNoBlockChanged(tabId);
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
      await getDiffsBlockChanged(count_block, tabId); 
      console.log("getDiffsBlockChangedが走ったで");
    }
    numberOfMessagePrevious = numberOfMessage;
  }
}

//Get a block count that contains names and times, messages
function getNumberOfBlocks() {
  return document.getElementsByClassName("GDhqjd").length;
}

//Get a number of messages
function getNumberOfMessages() {
  return document.getElementsByClassName("oIy2qc").length;
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

//Get Messages from "Google Meet Chat"
function parseMessage(i) {
  return document.getElementsByClassName("oIy2qc")[i].textContent;
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

//Animate messages
async function animateMessages(count) {
  var p = document.querySelector("#message" + count);
  var randomSpeed = Math.floor(Math.random() * 10001) + 20000;
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
      messageExecuteCount = numberOfMessage - 1; 
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
