var chatLines = null;
var lastLine = null;

var checkFrequency = 1000;
var checkTimeout = null;

var urlQueue = [];

var port = null;



// main loop

function checkLines() {
  console.log('checkLines');  
  if (chatUnavailable()) {
    reset();
    scheduleNext();
    return;
  }

  var nextLine = lastLine ? getNextLine() : getFirstLine();
  lastLine = nextLine || lastLine;

  if (nextLine) {
    var urls = getUrls(nextLine);
    urlQueue = urlQueue.concat(urls);

    requestAnimationFrame(checkLines);
  }
  else {
    if (urlQueue.length) {
      port.postMessage({
        type: 'newUrls',
        urls: urlQueue
      });
      urlQueue = [];
    }

    scheduleNext();
  }
}



// helper functions

function getFirstLine() {
  return chatLines.children.length ? chatLines.children[0] : null;
}

function getNextLine() {
  return lastLine.nextElementSibling;
}

function getUrls(line) {
  var links = line.querySelectorAll('.message a');
  var urls = [];

  for (var i = 0; i < links.length; i++) {
    urls.push(links[i].getAttribute('href'));
  }

  return urls;
}

function chatUnavailable() {
  var noChatContainer = !chatLines;
  var chatContainerDetached = lastLine && ! lastLine.parentElement;

  return noChatContainer || chatContainerDetached;
}

function reset() {
  chatLines = document.querySelector('.chat-lines');
  lastLine = null;
}

function scheduleNext() {
  checkTimeout = setTimeout(checkLines, checkFrequency);
}



// start the interval show!

window.onload = function() {
  port = chrome.runtime.connect({name:"twitchLinksMonitor"});
  port.postMessage({
    type: 'statusChange',
    status: 'ready'
  });
  scheduleNext();
}
