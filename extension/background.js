// GitForge Chrome Extension Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('GitForge extension successfully installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'OPEN_GITFORGE') {
    const url = request.username ? `https://gitforge.ai.studio/profile/${request.username}` : 'https://gitforge.ai.studio';
    chrome.tabs.create({ url });
  }
  return true;
});
