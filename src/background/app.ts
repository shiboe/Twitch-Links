import { LinkManager } from './classes/link-manager.class';
import { Tab } from './classes/tab';

const linkManager = new LinkManager();
var showing: number;

// take actions when recieving messages from content
chrome.runtime.onMessage.addListener((message, sender, handler) => {
  let force = false;
  let unpop = false;

  if (message) {
    switch (message.type) {

      case 'addLinks':
        linkManager.add(message.links, message.streamer);
        break;

      case 'hideLink':
        linkManager.hide(message.link);
        force = true;
        break;

      case 'unHideLink':
        linkManager.unHide(message.link);
        force = true;
        break;

      case 'saveLink':
        linkManager.save(message.link);
        force = true;
        break;

      case 'unSaveLink':
        linkManager.unSave(message.link);
        force = true;
        break;

      case 'unPopOverlay':
        showing = null;
        return;
    }
  }

  const sendingTab = new Tab(sender.tab);

  if (sendingTab.twitch && sendingTab.streamer) {
    const links = linkManager.getLinks(sendingTab.streamer);
    const showTab = message && message.type.indexOf('show') === 0;

    chrome.tabs.sendMessage(sender.tab.id, {
      type: showTab ? message.type : 'updateLinks',
      links: links,
      force: force,
      saved: linkManager.getSaved(),
      hidden: linkManager.getHidden()
    });

    if (sendingTab.isActive()) {
      chrome.browserAction.setBadgeText({
        text: links.length.toString()
      });
    }
  }
});

// update interface on tab switch
chrome.tabs.onActivated
  .addListener(function(activeInfo: chrome.tabs.TabActiveInfo) {
    chrome.tabs.get(activeInfo.tabId, (tab: chrome.tabs.Tab) => {
      const activeTab = new Tab(tab);
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
  const activeTab = new Tab(tab);
  const wasShowing = showing;

  if (showing) {
    chrome.tabs.sendMessage(showing, {type: 'unpopOverlay'});
    showing = null;
  }

  if (activeTab.twitch && activeTab.streamer && activeTab.id !== wasShowing) {
    showing = activeTab.id;
    chrome.tabs.sendMessage(activeTab.id, {
      type: 'popOverlay',
      links: linkManager.getLinks(activeTab.streamer)
    });
  }
});
