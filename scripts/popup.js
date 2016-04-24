var activeUrls = null;
var ignoreUrls = null;

function createLine(urlObj) {
  var newLine = document.createElement('li');
  var move = document.createElement('a');
  var link = document.createElement('a');

  move.classList.add('move');
  move.innerHTML = '<i class="fa fa-arrow-up" aria-hidden="true"></i><i class="fa fa-arrow-down" aria-hidden="true"></i>'

  link.href = urlObj.url;
  link.innerHTML = urlObj.url;
  link.target = '_blank';
  link.classList.add('link');
  link.title = urlObj.url;

  function click() {
    urlObj.ignore = !urlObj.ignore;

    var moveTo = urlObj.ignore ? ignoreUrls : activeUrls;
    moveTo.insertBefore(newLine, moveTo.firstChild);
  }

  move.onclick = click;

  if (!urlObj.ignore) {
    link.onclick = click;
  }

  newLine.appendChild(move);
  newLine.appendChild(link);

  return newLine;
}

function loadLinks() {
  var background = chrome.extension.getBackgroundPage();
  var hasHidden = false;

  if (background.urlData.length) {
    document.body.classList.add('has-links');

    background.urlData.forEach(function(urlObj) {
      var line = createLine(urlObj);
      var container = urlObj.ignore ? ignoreUrls : activeUrls;

      if (urlObj.ignore) {
        hasHidden = true;
      }

      container.insertBefore(line, container.firstChild);
    });

    if (!hasHidden) {
      document.body.classList.add('has-no-hidden');
    }
  }
}



window.onload = function() {
  activeUrls = document.getElementById('active-urls');
  ignoreUrls = document.getElementById('ignore-urls');

  loadLinks();

  document.getElementById('clear-all').addEventListener('click', function() {
    var background = chrome.extension.getBackgroundPage();

    background.urls = [];
    background.urlData = [];

    activeUrls.innerHTML = '';
    ignoreUrls.innerHTML = '';

    document.body.classList.remove('has-links');
  });

  document.getElementById('filter').addEventListener('keyup', function(e) {
    var rows = document.querySelectorAll('#lists li');
    var reg = new RegExp(e.target.value, 'i');

    for (var i=0; i<rows.length; i++) {
      var link = rows[i].querySelector('.link');
      var match = reg.test(link.getAttribute('href'));
      rows[i].classList[!match ? 'add':'remove']('no-match');
    }
  });

  document.getElementById('show-hidden').addEventListener('click', function(e) {
    document.body.classList.add('show-hidden');
  });
}
