("use strict");
//Initialize some variables
let tabId,
  messageChecked,
  numberOfMessagePrevious = 0,
  countBlockPrevious = 0,
  messageExecuteCount = 0,
  count = 0,
  firstFireFlag = true;

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
  //Execute every 0.25 seconds
  let timerId = setInterval(async () => {
    await main(timerId, messageChecked);
  }, 250);
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
  } else if (numberOfMessagePrevious < numberOfMessage) {
    await getDiff(countBlock, numberOfMessage);
    console.log("getDiffが走ったで");
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
    var contentLength = document.querySelector(
      "#ow3 > div.T4LgNb > div > div:nth-child(10) > div.crqnQb > div.R3Gmyc.qwU8Me > div.WUFI9b > div.hWX4r > div > div.z38b6 > div > div.Zmm6We"
    ).childElementCount;
  } else {
    var contentLength = document.querySelector(
      "#ow3 > div.T4LgNb > div > div:nth-child(10) > div.crqnQb > div.R3Gmyc.qwU8Me > div.WUFI9b > div.hWX4r > div > div.z38b6 > div:nth-child(" +
        String(i + 1) +
        ") > div.Zmm6We"
    ).childElementCount;
  }
  return contentLength;
}

//Get Messages from "Google Meet Chat"
function parseMessage(i, j) {
  var message = document.querySelector(
    "#ow3 > div.T4LgNb > div > div:nth-child(10) > div.crqnQb > div.R3Gmyc.qwU8Me > div.WUFI9b > div.hWX4r > div > div.z38b6 > div:nth-child(" +
      String(j + 1) +
      ") > div.Zmm6We > div:nth-child(" +
      String(i + 1) +
      ")"
  ).textContent;
  return message;
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

//Execute when there are diffs of blocks
async function getDiff(countBlock, numberOfMessage) {
  const countMessage = getMessageCount(countBlock - 1);
  await getMessage(countMessage - 1, countBlock - 1);
  numberOfMessagePrevious = numberOfMessage;
}

async function getMessage(i, j) {
  const message = parseMessage(i, j);
  await insertMessage(message, count);
  await animateMessages(count);
  console.log(message);
  count++;
}
