function enablePiP() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (!tabId) return;

    chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: () => {
        const videos = document.querySelectorAll('video');
        if (videos.length === 0) return false;

        let best = videos[0];
        for (const v of videos) {
          v.disablePictureInPicture = false;
          if (v.offsetWidth * v.offsetHeight > best.offsetWidth * best.offsetHeight) {
            best = v;
          }
        }

        if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
          return 'exited';
        }

        return best.requestPictureInPicture().then(() => 'started').catch(() => false);
      }
    }).catch(() => {});
  });
}

chrome.action.onClicked.addListener(enablePiP);
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-pip') enablePiP();
});
