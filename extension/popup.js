document.getElementById('launchBtn').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim() || 'octocat';
  chrome.tabs.create({ url: `https://gitforge.dev/profile/${encodeURIComponent(username)}` });
});

