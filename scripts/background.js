var urls =[];
var urlData = [];
var status = 'loading';



// helpers

function addNewUrls(sentUrls) {
  var before = urls.length;

  sentUrls.forEach(function(url) {
    var normalizedUrl = normalize(url);

    if (urls.indexOf(normalizedUrl) == -1) {
      urls.push(normalizedUrl);
      urlData.push(new urlDataObj(normalizedUrl));
    }
  });

  return urls.length > before;
}

function urlDataObj(url) {
  this.url = url;
  this.ignore = false;
}

function normalize(url) {
  var repeats = url.split(/https?:\/\//).splice(1);
  var ssl = url[4] === 's';
  var first = repeats.pop();

  if (repeats.length) {
    while (repeats.length) {
      var next = repeats.pop();
      if (next !== first) {
        return url;
      }
    }

    if (repeats.length === 0) {
      url = 'http' + (ssl?'s':'') + '://' + first;
    }
  }

  return url;
}



// register our reaction functions so things happen!

chrome.runtime.onConnect.addListener(function(port){
  port.onMessage.addListener(function(msg) {
    switch (msg.type) {
      case 'newUrls': addNewUrls(msg.urls); break;
      case 'statusChange': status = msg.status; break;
    }
  });
});
