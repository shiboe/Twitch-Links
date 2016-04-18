var urls =[];
var urlData = [];
var status = 'loading';



// helpers

function addNewUrls(sentUrls) {
  var before = urls.length;

  sentUrls.forEach(function(url) {
    if (urls.indexOf(url) == -1) {
      urls.push(url);
      urlData.push(new urlDataObj(url));
    }
  });

  return urls.length > before;
}

function urlDataObj(url) {
  this.url = url;
  this.ignore = false;
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
