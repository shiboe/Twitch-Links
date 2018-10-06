import { Link } from '../../classes/link.class';
import { messenger } from './messenger.class';

type Callback = (payload: any) => void

export class Listener {
  callback: Callback;

  constructor(callback: Callback) {
    chrome.runtime.onMessage.addListener((...args) => {
      this.onMessage.apply(this, args);
    });

    this.callback = callback;

    document.addEventListener('click', this.closeOnClickElsewhere);
  }

  onMessage(request, sender, sendResponse) {
    switch (request.type) {

      case 'popOverlay':
        document.getElementById('twitchlinks-root').classList.add('showing');
        break

      case 'unpopOverlay':
        document.getElementById('twitchlinks-root').classList.remove('showing');
        break
    }

    this.callback(request);
  }

  destroy() {
    chrome.runtime.onMessage.removeListener((...args) => {
      this.onMessage.call(this, args);
    });

    document.removeEventListener('click', this.closeOnClickElsewhere);
  }

  closeOnClickElsewhere(event) {
    let target = event.target || event.srcElement;

    while (target.id !== 'twitchlinks-root' && target.parentElement) {
      target = target.parentElement;
    }

    if (!target || target.id !== 'twitchlinks-root') {
      document.getElementById('twitchlinks-root').classList.remove('showing');
      messenger.unPopOverlay();
    }
  }
}
