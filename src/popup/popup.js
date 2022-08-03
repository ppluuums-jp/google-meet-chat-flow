("use strict");
//Initialize some variables
let tabId;
let meetURL = "https://meet.google.com/";
let numberOfMessage_previous = 0;
let count_block_previous = 0;
let message_execute_count = 0;
let i_tmp = 0;
let j_tmp = 0;
let no_message_flag = false;
let count = 0;
let toggleFlag;

//Get a current tab's id
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  tabId = tabs[0].id;
  if (tabs[0].url.indexOf(meetURL)) {
    console.log("Click on the meet tab.");
    // setErrorMessage("Click on the meet tab.");
    // toggleError(true);
  } else {
    chrome.storage.local.set({ checkedFlag: true }, function () {});
    console.log("set");
  }
});

chrome.storage.local.get("checkedFlag", async function (result) {
  toggleFlag = result.checkedFlag;
  console.log(toggleFlag);
});

//Execute when the toggle gets on
document.querySelector("#toggle").addEventListener("change", async () => {
  await main();
  //Execute every 3 seconds
  let timerId = setInterval(async () => {
    await main();
    if (true) {
      document.querySelector("#toggle").checked = true;
      console.log("passed");
      console.log(document.querySelector("#toggle").checked);
    }
    let flag = document.querySelector("#toggle").checked;
    // console.log(flag);
    if (flag == false) {
      clearInterval(timerId);
    }
  }, 1000);
});

//checkboxオンにしたときにこれまでのメッセージ読む必要ないな
async function main() {
  const count_block = await returnNumberOfBlocks(tabId);
  const numberOfMessage_object = await returnNumberOfMessages(tabId);
  const numberOfMessage = numberOfMessage_object.result;

  //see if there are diffs of number of messages
  if (numberOfMessage == 0 && !no_message_flag) {
    // setMessage("No message found.");
    console.log("No message found.");
    no_message_flag = true;
  } else if (numberOfMessage_previous < numberOfMessage) {
    //Execute
    if (no_message_flag) {
      // parent.innerHTML = "";
      no_message_flag = false;
    }
    //see if there are diffs of number of blocks
    if (count_block_previous == count_block.result) {
      await getDiffs(tabId, count);
    } else {
      await getNewMessage(count_block, tabId, count);
    }
    numberOfMessage_previous = numberOfMessage;
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
          reject(new Error("Failed to insert messages."));
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

//Execute when there are diffs of blocks
async function getNewMessage(count_block, tabId, count) {
  //Count messages to get start point
  for (let i = i_tmp; i < count_block.result; i++) {
    const count_message = await returnMessageCount(tabId, i);

    //Get messages for each name_times
    for (let j = 0; j < count_message.result; j++) {
      const get_message = await getMessage(tabId, message_execute_count);
      const message = get_message.result;
      await executeInsertion(tabId, message, count);
      await executeAnimation(tabId, count);
      console.log(message);
      message_execute_count++;
      count++;
      j_tmp = j + 1;
    }
    i_tmp = i + 1;
  }
  count_block_previous = count_block.result;
}

async function getDiffs(tabId, count) {
  const count_message = await returnMessageCount(tabId, i_tmp - 1);

  for (let j = j_tmp; j < count_message.result; j++) {
    const get_message = await getMessage(tabId, message_execute_count);
    const message = get_message.result;
    await executeInsertion(tabId, message, count);
    await executeAnimation(tabId, count);
    console.log(message);
    message_execute_count++;
    count++;
    j_tmp = j + 1;
  }
}
