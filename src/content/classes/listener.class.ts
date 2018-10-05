import { Link } from '../../classes/link.class';

type Callback = (type: string, links: Link[], force?: boolean) => void

export class Listener {
  callback: Callback;

  constructor(callback: Callback) {
    chrome.runtime.onMessage.addListener((...args) => {
      this.onMessage.apply(this, args);
    });
    this.callback = callback;
  }

  onMessage(request, sender, sendResponse) {
    console.log('onMessage', request)
    switch (request.type) {

      case 'showLinks':
        document.getElementById('twitchlinks-root').classList.add('showing');
        this.callback('show', request.links);
        break

      case 'updateLinks':
        this.callback('update', request.links, request.force);
        break;

      case 'hideLinks':
        document.getElementById('twitchlinks-root').classList.remove('showing');
        this.callback('hide', []);
    }
  }

  destroy() {
    chrome.runtime.onMessage.removeListener((...args) => {
      this.onMessage.call(this, args);
    });
  }
}
