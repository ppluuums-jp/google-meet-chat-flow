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
  await init();
  if (messageChecked == false) {
    firstFireFlag = true;
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
  const countBlock = getNumberOfBlocks();
  const numberOfMessage = getNumberOfMessages();
  if (messageChecked === false) {
    clearInterval(timerId);
  }
  if (firstFireFlag) {
    if (numberOfMessagePrevious + 1 == numberOfMessage) {
      firstFireFlag = false;
    }
    return;
  } else if (numberOfMessagePrevious < numberOfMessage) {
    await getDiff(countBlock, numberOfMessage);
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
      "#ow3 > div.T4LgNb > div > div:nth-child(12) > div.crqnQb > div.R3Gmyc.qwU8Me > div.WUFI9b > div.hWX4r > div > div.z38b6 > div > div.Zmm6We"
    ).childElementCount;
  } else {
    var contentLength = document.querySelector(
      "#ow3 > div.T4LgNb > div > div:nth-child(12) > div.crqnQb > div.R3Gmyc.qwU8Me > div.WUFI9b > div.hWX4r > div > div.z38b6 > div:nth-child(" +
        String(i + 1) +
        ") > div.Zmm6We"
    ).childElementCount;
  }
  return contentLength;
}

//Get Messages from "Google Meet Chat"
function parseMessage(i, j) {
  var message = document.querySelector(
    "#ow3 > div.T4LgNb > div > div:nth-child(12) > div.crqnQb > div.R3Gmyc.qwU8Me > div.WUFI9b > div.hWX4r > div > div.z38b6 > div:nth-child(" +
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
    Math.random() * document.documentElement.clientHeight * 0.85
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
  p.style.textShadow =
    "1px 1px black, -1px -1px black,1px -1px black, -1px 1px black,0px 1px black, 1px 0px black,-1px 0px black, 0px -1px black";
  p.appendChild(document.createTextNode(message));
  document.body.appendChild(p);
}

//Animate messages
async function animateMessages(count) {
  var p = document.querySelector("#message" + count);
  var randomSpeed = Math.floor(Math.random() * 4500) + 6000;
  p.animate(
    [
      // keyframes
      { transform: "translateX(0vw)" },
      {
        transform:
          "translateX(" +
          -1 * (document.documentElement.clientWidth + p.clientWidth) +
          "px)",
      },
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

//Execute when there are number of diffs
async function getDiff(countBlock, numberOfMessage) {
  const countMessage = getMessageCount(countBlock - 1);
  await getMessage(countMessage - 1, countBlock - 1);
  numberOfMessagePrevious = numberOfMessage;
}

//Implement of actual a get func
async function getMessage(i, j) {
  const message = parseMessage(i, j);
  await insertMessage(message, count);
  await animateMessages(count);
  count++;
}
