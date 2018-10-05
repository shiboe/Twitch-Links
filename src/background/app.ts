import { LinkManager } from './classes/link-manager.class';
import { ActiveTab } from './classes/active-tab';

const linkManager = new LinkManager();
var showing: number;

// take actions when recieving messages from content
chrome.runtime.onMessage.addListener((message, sender, handler) => {
  let force = false;

  if (message && message.type == 'addLinks') {
    linkManager.add(message.links, message.streamer);
  }

  if (message && message.type == 'hideLink') {
    linkManager.hide(message.link);
    force = true;
  }

  if (message && message.type == 'unHideLink') {
    linkManager.unHide(message.link);
    force = true;
  }

  if (message && message.type == 'saveLink') {
    linkManager.save(message.link);
  }

  if (message && message.type == 'unSaveLink') {
    linkManager.unSave(message.link);
  }

  const activeTab = new ActiveTab(sender.tab);

  if (activeTab.twitch && activeTab.streamer) {
    const links = linkManager.getLinks(activeTab.streamer);

    chrome.tabs.sendMessage(sender.tab.id, {
      type: 'updateLinks',
      links: links,
      force: force
    });

    chrome.browserAction.setBadgeText({
      text: links.length.toString()
    });
  }
});

// update interface on tab switch
chrome.tabs.onActivated
  .addListener(function(activeInfo: chrome.tabs.TabActiveInfo) {
    chrome.tabs.get(activeInfo.tabId, (tab: chrome.tabs.Tab) => {
      const activeTab = new ActiveTab(tab);
      let badgeText = '';

      if (activeTab.twitch && activeTab.streamer) {
        const linkCount = linkManager.getLinkCount(activeTab.streamer);

        if (linkCount) {
          badgeText = linkCount.toString();
        }
      }

      chrome.browserAction.setBadgeText({
        text: badgeText
      });
    });
  });

// hide/show links on an active streamer tab when icon clicked
chrome.browserAction.onClicked.addListener((tab: chrome.tabs.Tab) => {
  const activeTab = new ActiveTab(tab);
  const wasShowing = showing;

  if (showing) {
    chrome.tabs.sendMessage(showing, {type: 'hideLinks'});
    showing = null;
  }

  if (activeTab.twitch && activeTab.streamer && activeTab.id !== wasShowing) {
    showing = activeTab.id;
    chrome.tabs.sendMessage(activeTab.id, {
      type: 'showLinks',
      links: linkManager.getLinks(activeTab.streamer)
    });
  }
});
