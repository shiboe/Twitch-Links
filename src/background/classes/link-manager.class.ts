import { Link, maxDuration } from '../../classes/link.class';

export class LinkManager {
  private streamerLinks = {};

  private hiddenLinks: string[] = [];
  private savedLinks: string[] = [];

  add(links: string[], streamer: string) {
    if (!this.streamerLinks[streamer]) {
      this.streamerLinks[streamer] = {};
    }

    links.forEach((link) => {
      this.streamerLinks[streamer][link] = Date.now();
    });
  }

  hide(link) {
    if (this.hiddenLinks.indexOf(link) === -1) {
      this.hiddenLinks.push(link);
    }
  }

  unHide(link) {
    const index = this.hiddenLinks.indexOf(link);

    if (index >= 0) {
      this.hiddenLinks.splice(index, 1);
    }
  }

  save(link) {
    if (this.savedLinks.indexOf(link) === -1) {
      this.savedLinks.push(link);
    }
  }

  unSave(link) {
    const index = this.savedLinks.indexOf(link);

    if (index >= 0) {
      this.savedLinks.splice(index, 1);
    }
  }

  getLinks(streamer: string): Link[] {
    this.removeOldLinks();

    if (this.streamerLinks[streamer]) {
      console.log('streamer', streamer, this.streamerLinks[streamer])
      return Object.keys(this.streamerLinks[streamer]).map((url) => {
        return {
          url: url,
          created: this.streamerLinks[streamer][url],
          hidden: this.hiddenLinks.indexOf(url) >= 0,
          saved: this.savedLinks.indexOf(url) >= 0
        };
      });
    } else {
      return [];
    }
  }

  getLinkCount(streamer: string) {
    return this.streamerLinks[streamer] ?
      Object.keys(this.streamerLinks[streamer]).length : 0;
  }

  removeOldLinks() {
    Object.keys(this.streamerLinks).forEach((streamer) => {
      Object.keys(this.streamerLinks[streamer]).forEach((url) => {
        const created = this.streamerLinks[streamer][url];

        if (Date.now() - created >= maxDuration) {
          delete this.streamerLinks[streamer][url];
        }
      });
    });
  }
}
