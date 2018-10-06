const sendMessage = (
  payload: any,
  responseCallback?: (response: any) => void) => {
  try {
    chrome.runtime.sendMessage(payload, responseCallback);
  } catch (error) {
    if (error.message.match(/Invocation of form runtime\.connect/) &&
      error.message.match(/doesn't match definition runtime\.connect/)) {
        console.error(`The Twitchlinks extension has been updated/reloaded.` +
        ` Please refresh this page to regain functionality.`);
      } else {
        throw error;
      }
  }
}

export const messenger = {

  addLinks(links: string[]) {
    sendMessage({
      type: 'addLinks',
      links: links,
      streamer: window.location.pathname.split('/')[1]
    });
  },

  hideLink(link: string) {
    sendMessage({
      type: 'hideLink',
      link: link
    });
  },

  unHideLink(link: string) {
    sendMessage({
      type: 'unHideLink',
      link: link
    });
  },

  saveLink(link: string) {
    sendMessage({
      type: 'saveLink',
      link: link
    });
  },

  unSaveLink(link: string) {
    sendMessage({
      type: 'unSaveLink',
      link: link
    });
  },

  showAll() {
    sendMessage({ type: 'showAll' });
  },

  showSaved() {
    sendMessage({ type: 'showSaved' });
  },

  showHidden() {
    sendMessage({ type: 'showHidden' });
  },

  unPopOverlay() {
    sendMessage({ type: 'unPopOverlay' });
  }
}
