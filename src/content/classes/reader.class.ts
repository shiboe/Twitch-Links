import { messenger } from './messenger.class';

declare var window: any;

window.test = [];

const messageSelectors = [
  '.chat-line__message',
  '.chat-message'
]

const linkSelectors = [
  '.link-fragment',
  '.chat-message__link'
]

export class Reader {
  lastMessage: Element;
  interval;

  constructor() {}

  start() {
    this.interval = setInterval(() => {
      this.readLoop();
    }, 1000);
  }

  stop() {
    window.clearInterval(this.interval);
  }

  readLoop() {
    // if the last message is no longer available, clear it because not usable
    if (this.lastMessage && !this.isInDom(this.lastMessage)) {
      this.lastMessage = null;
    }

    // then get the next message if we have a usable one, or first message
    const newMessages = [];
    let nextMessage = this.lastMessage ?
      this.getNextMessage(this.lastMessage) : this.getFirstMessage();

    if (nextMessage) {
      while (nextMessage) {
        newMessages.push(nextMessage);
        nextMessage = this.getNextMessage(nextMessage);
      }

      // and save the message
      this.saveMessages(newMessages);
    }
  }

  saveMessages(messages: Element[]) {
    if (messages.length) {
      this.lastMessage = messages[messages.length - 1];
      let links = messages
        .map((message) => this.getLinksFromMessage(message))
        .reduce((result, current) => {
          const unique = current.filter((link) => result.indexOf(link) == -1);
          return result.concat(unique);
        });

      if (links.length) {
        messenger.addLinks(links);
        window.test.push(links);
      }
    }
  }

  getNextMessage(message: Element): Element {
    return message.nextElementSibling;
  }

  getFirstMessage(): Element {
    return document.querySelector(messageSelectors.join(','));
  }

  getLinksFromMessage(message: Element): string[] {
    const links = message.querySelectorAll(linkSelectors.join(','));

    return [].slice.call(links).map((link) => {
      return this.normalize(link.getAttribute('href'))
    });
  }

  isInDom(el: Element) {
    if (!el) {
      return false;
    } else if (el.tagName === 'BODY') {
      return true;
    } else {
      return this.isInDom(el.parentElement);
    }
  }

  normalize(url: string): string {
    try {
      const repeats = url.split(/https?:\/\//).splice(1);
      const ssl = url[4] === 's';
      const first = repeats.pop();

      if (repeats.length) {
        while (repeats.length) {
          const next = repeats.pop();
          if (next !== first) {
            return url;
          }
        }

        const protocol = ssl ? 'https' : 'http';
        if (repeats.length === 0) {
          url = protocol + "://" + first;
        }
      }
    } catch (error) {
      console.log('Failed to normalize url', url, error);
    }

    return url;
  }
}
