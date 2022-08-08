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
  firstFireAfterFlag = true;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  tabId = sender.id;
  messageChecked = message.checked;
  console.log("status:" + message.checked);
  console.log("run");
  await init();
  console.log("init");
  if (messageChecked == false) {
    firstFireFlag = true;
    console.log("firstfireflagをtrueに戻したよ");
  }
  //Execute every 3 seconds
  let timerId = setInterval(async () => {
    await main(timerId, messageChecked);
  }, 750);
  return true;
});

async function init() {
  const countBlock = getNumberOfBlocks();
  const numberOfMessage = getNumberOfMessages();
  countBlockPrevious = countBlock;
  numberOfMessagePrevious = numberOfMessage;
}

async function main(timerId, messageChecked) {
  console.log("ちゃんと読まれてる" + messageChecked);
  // if (messageChecked) {
  //   firstFireFlag = false;
  // } else {
  //   firstFireFlag = true;
  // }
  const countBlock = getNumberOfBlocks();
  console.log("countBlock:" + countBlock);
  const numberOfMessage = getNumberOfMessages();
  console.log("numberOfMessage:" + numberOfMessage);
  console.log("numberOfMessagePrevious:" + numberOfMessagePrevious);
  console.log("main");
  if (messageChecked === false) {
    clearInterval(timerId);
    console.log("clear");
  }
  if (firstFireFlag) {
    if (numberOfMessagePrevious + 1 == numberOfMessage) {
      firstFireFlag = false;
    }
    console.log("stay");
    return;
  } else if (numberOfMessagePrevious <= numberOfMessage) {
    //see if there are diffs of number of blocks
    console.log("hoge");
    if (firstFireAfterFlag && numberOfMessagePrevious + 1 == numberOfMessage) {
      await getFirstMessageAfterFiredNoBlockChanged(
        countBlock,
        numberOfMessage
      );
      console.log("getFirstMessageAfterFiredNoBlockChangedが走ったで");
      firstFireAfterFlag = false;
    } else if (firstFireAfterFlag && countBlockPrevious + 1 == countBlock) {
      await getFirstMessageAfterFiredBlockChanged(countBlock, numberOfMessage);
      console.log("getFirstMessageAfterFiredBlockChangedが走ったで");
      firstFireAfterFlag = false;
    } else if (countBlockPrevious == countBlock) {
      iTmp = countBlock;
      //  countBlockPrevious = countBlock;
      await getDiffsNoBlockChanged();
      console.log("getDiffsNoBlockChangedが走ったで");
      console.log(firstFireAfterFlag);
    } else {
      await getDiffsBlockChanged(countBlock);
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
}

//Execute when gets first message after the firing
async function getFirstMessageAfterFiredBlockChanged(
  countBlock,
  numberOfMessage
) {
  //Count messages to get start point
  for (let i = countBlock; i < countBlock + 1; i++) {
    console.log(i - 1);
    console.log(countBlock);

    //Get messages for each name_times
    for (let j = 0; j < 1; j++) {
      messageExecuteCount = numberOfMessage - 1;
      console.log(messageExecuteCount);
      await getMessageForEachNameAndTime(j);
    }
    iTmp = countBlock;
  }
  countBlockPrevious = countBlock;
}

async function getFirstMessageAfterFiredNoBlockChanged(
  countBlock,
  numberOfMessage
) {
  // const countMessage = 1;

  for (let j = jTmp; j < 1; j++) {
    messageExecuteCount = numberOfMessage - 1;
    await getMessageForEachNameAndTime(j);
  }
  iTmp = countBlock;
  countBlockPrevious = countBlock;
}

//Execute when there are diffs of blocks
async function getDiffsBlockChanged(countBlock) {
  //Count messages to get start point
  for (let i = iTmp; i < countBlock; i++) {
    const countMessage = getMessageCount(i);
    console.log(iTmp);

    //Get messages for each name_times
    for (let j = 0; j < countMessage; j++) {
      await getMessageForEachNameAndTime(j);
    }
    iTmp = i + 1;
  }
  countBlockPrevious = countBlock;
}

async function getDiffsNoBlockChanged() {
  console.log(iTmp - 1);
  const countMessage = getMessageCount(iTmp - 1);
  console.log(countMessage);

  for (let j = jTmp; j < countMessage; j++) {
    await getMessageForEachNameAndTime(j);
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
