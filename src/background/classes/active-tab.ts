export class ActiveTab {
  private tab: chrome.tabs.Tab;

  id: number;
  twitch: boolean;
  streamer: string;

  constructor(tab: chrome.tabs.Tab) {
    this.tab = tab;
    this.id = tab.id;
    this.twitch = this.isTwitch(tab);
    this.streamer = this.twitch ? this.getStreamer(tab.url) : null;
  }

  private isTwitch(tab: chrome.tabs.Tab) {
    if (!tab.url) {
      return false;
    }

    const urlParts = tab.url.split('/');
    const domain = urlParts[2];

    return domain === 'go.twitch.tv' || domain === 'www.twitch.tv';
  }

  private getStreamer(url: string) {
    const urlParts = url.split('/');
    return urlParts.length >= 4 ? urlParts[3] : null;
  }
}
